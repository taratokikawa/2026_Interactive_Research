import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { supabase } from '../lib/supabase';

type MyTutorRequestRow = {
  id: string;
  subject: string;
  details: string;
  proposed_start: string;
  proposed_end: string;
  status: string;
  profiles: { username: string; email: string } | null;
};

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

const formatReadable = (isoString: string) =>
  new Date(isoString).toLocaleString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

const formatGCalDate = (isoString: string) =>
  new Date(isoString).toISOString().replace(/[-:]|\.\d{3}/g, '');

export default function MyTutorRequests() {
  const [requests, setRequests] = useState<MyTutorRequestRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('tutor_requests')
      .select('*, profiles:teacher_id(username, email)')
      .eq('student_id', userData.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('fetchMyRequests error:', error.message);
    }

    setRequests(data ?? []);
    setLoading(false);
  };

  const buildGoogleCalendarUrl = (request: MyTutorRequestRow) => {
    const dates = `${formatGCalDate(request.proposed_start)}/${formatGCalDate(request.proposed_end)}`;
    const text = encodeURIComponent(`Tutoring: ${request.subject}`);
    const details = encodeURIComponent(request.details ?? '');
    const guest = request.profiles?.email
      ? `&add=${encodeURIComponent(request.profiles.email)}`
      : '';

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}${guest}`;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  const pending = requests.filter((r) => r.status === 'pending');
  const accepted = requests.filter((r) => r.status === 'accepted');

  const renderRequest = (request: MyTutorRequestRow) => (
    <View key={request.id} style={styles.card}>
      <Text style={styles.cardText}>{request.subject}</Text>
      <Text style={styles.cardSubText}>{request.details}</Text>
      <Text style={styles.cardSubText}>Status: {capitalize(request.status)}</Text>
      <Text style={styles.cardSubText}>Start: {formatReadable(request.proposed_start)}</Text>
      <Text style={styles.cardSubText}>End: {formatReadable(request.proposed_end)}</Text>

      {request.status === 'accepted' && (
        <>
          <Text style={styles.cardSubText}>
            Tutor: {request.profiles?.username ?? 'Assigned'}
          </Text>
          {request.profiles?.email && (
            <Text style={styles.cardSubText}>Email: {request.profiles.email}</Text>
          )}
          <TouchableOpacity
            style={styles.showMoreButton}
            onPress={() => Linking.openURL(buildGoogleCalendarUrl(request))}
          >
            <Text style={styles.showMoreText}>Add to Calendar</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  return (
    <View style={styles.background}>
        <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>My Tutor Requests</Text>

        <Text style={styles.sectionTitle}>Pending ({pending.length})</Text>
        {pending.length === 0 ? (
            <Text style={styles.cardText}>No pending requests</Text>
        ) : (
            pending.map(renderRequest)
        )}

        <Text style={styles.sectionTitle}>Accepted ({accepted.length})</Text>
        {accepted.length === 0 ? (
            <Text style={styles.cardText}>No accepted requests yet</Text>
        ) : (
            accepted.map(renderRequest)
        )}
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#FFE787',
  },
  container: {
    padding: 20,
    gap: 8,
  },
  title: {
    fontSize: 50,
    fontWeight: '700',
    marginBottom: 12,
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: '#fff',
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 20,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 25,
    fontWeight: '500',
    color: '#4d3b2c',
  },
  cardSubText: {
    fontSize: 20,
    color: '#8a6d5c',
    marginTop: 2,
  },
  showMoreButton: {
    backgroundColor: '#A7C7E7',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: 'center',
  },
  showMoreText: {
    color: '#fff',
    fontSize: 20,
  },
});