import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';

type FeedbackSummary = {
  avg_effectiveness: number;
  avg_usability: number;
  avg_style: number;
  total_responses: number;
};

type FeedbackEntry = {
  username: string;
  effectiveness_rating: number;
  usability_rating: number;
  style_rating: number;
  comments: string | null;
  submitted_at: string;
};

export default function FeedbackDetail() {
  const [summary, setSummary] = useState<FeedbackSummary | null>(null);
  const [entries, setEntries] = useState<FeedbackEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [{ data: summaryData }, { data: entryData }] = await Promise.all([
      supabase.rpc('get_feedback_summary'),
      supabase.rpc('get_all_feedback'),
    ]);

    setSummary(summaryData?.[0] ?? null);
    setEntries(entryData ?? []);
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Feedback</Text>

      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.cardText}>Average Effectiveness Rating</Text>
          <Text style={styles.cardSubText}>
            {summary ? Number(summary.avg_effectiveness).toFixed(1) : '—'}
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.cardText}>Average Usability Rating</Text>
          <Text style={styles.cardSubText}>
            {summary ? Number(summary.avg_usability).toFixed(1) : '—'}
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.cardText}>Average Style Rating</Text>
          <Text style={styles.cardSubText}>
            {summary ? Number(summary.avg_style).toFixed(1) : '—'}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>
        All Responses ({summary?.total_responses ?? 0})
      </Text>

      {entries.length === 0 ? (
        <Text style={styles.emptyText}>No feedback submitted yet.</Text>
      ) : (
        entries.map((entry, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardText}>{entry.username}</Text>
            <Text style={styles.cardSubText}>
              Effectiveness: {entry.effectiveness_rating} | Usability: {entry.usability_rating} | Style: {entry.style_rating}
            </Text>
            {entry.comments ? (
              <Text style={styles.comments}>"{entry.comments}"</Text>
            ) : null}
            <Text style={styles.timestamp}>
              {new Date(entry.submitted_at).toLocaleString()}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFE787',
    padding: 20,
  },
  title: {
    fontSize: 40,
    color: 'white',
    marginVertical: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 25,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardSubText: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  comments: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 6,
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
  },
  emptyText: {
    color: 'white',
    fontStyle: 'italic',
  },
});