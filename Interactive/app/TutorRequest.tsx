import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';
import DateTimeField from '../components/DateTimeField';

export default function TutorRequest() {
  const router = useRouter();
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');
  const [proposedStart, setProposedStart] = useState(new Date());
  const [proposedEnd, setProposedEnd] = useState(new Date(Date.now() + 60 * 60 * 1000));
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!subject.trim()) {
      Alert.alert('Missing info', 'Please enter a subject.');
      return;
    }
    if (proposedEnd <= proposedStart) {
      Alert.alert('Check the times', 'End time needs to be after the start time.');
      return;
    }

    setSubmitting(true);

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setSubmitting(false);
      return;
    }

    const { error } = await supabase.from('tutor_requests').insert({
      student_id: userData.user.id,
      subject: subject.trim(),
      details: details.trim(),
      proposed_start: proposedStart.toISOString(),
      proposed_end: proposedEnd.toISOString(),
      status: 'pending',
    });

    setSubmitting(false);

    if (error) {
      Alert.alert('Error', 'Could not submit your request. Please try again.');
      return;
    }

    Alert.alert('Request sent', 'A teacher will reach out once they accept your request.');
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Find a Tutor</Text>

      <Text style={styles.label}>Subject</Text>
        <TextInput
          style={styles.input}
          value={subject}
          onChangeText={setSubject}
          placeholder="e.g. Algebra II, Essay Writing"
          placeholderTextColor="#888"
          maxLength={50}
        />
        <Text style={styles.charCount}>{subject.length}/50</Text>

        <Text style={styles.label}>What do you need help with?</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          value={details}
          onChangeText={setDetails}
          placeholder="Describe the topic or problem you're stuck on"
          placeholderTextColor="#888"
          multiline
          numberOfLines={4}
          maxLength={300}
        />
        <Text style={styles.charCount}>{details.length}/300</Text>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>Start time</Text>
          <DateTimeField
            value={proposedStart}
            onChange={setProposedStart}
          />
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>End time</Text>
          <DateTimeField
            value={proposedEnd}
            onChange={setProposedEnd}
          />
        </View>
      </View>
      <TouchableOpacity
        style={[styles.shopButton, submitting && styles.shopButtonDisabled]}
        onPress={handleSubmit}
        disabled={submitting}
      >
        <Text style={styles.shopButtonText}>
          {submitting ? 'Submitting...' : 'Submit Request'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFE787',
    padding: 30,
  },
  row: {
    flexDirection: 'row',
    gap: '3%',
  },
  column: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 50,
    fontWeight: '700',
    marginBottom: 16,
    color: '#fff',
  },
  label: {
    fontSize: 30,
    marginTop: 20,
    marginBottom: 10,
    color: '#4d3b2c',
  },
  input: {
    borderRadius: 8,
    padding: 20,
    fontSize: 20,
    color: '#4d3b2c',
    backgroundColor: '#fff',
  },
  charCount: {
    fontSize: 15,
    color: '#8a7f79',
    textAlign: 'right',
    marginTop: 5,
  },
  multilineInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  shopButton: {
    backgroundColor: '#A7C7E7',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 30,
    alignItems: 'center',
    width: "20%",
    alignSelf: 'center',
  },
  shopButtonDisabled: {
    opacity: 0.5,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 25,
  },
});