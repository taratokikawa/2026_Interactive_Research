import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '../lib/supabase';

type StudentDetail = {
  username: string;
  coins: number;
  correct_count: number;
  incorrect_count: number;
};

type CorrectQuestion = {
  subject: string;
  question: string;
  difficulty: string;
};

type IncorrectQuestion = {
  subject: string;
  question: string;
  difficulty: string;
  times_incorrect: number;
};

export default function StudentDetail() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const [detail, setDetail] = useState<StudentDetail | null>(null);
  const [correctQuestions, setCorrectQuestions] = useState<CorrectQuestion[]>([]);
  const [incorrectQuestions, setIncorrectQuestions] = useState<IncorrectQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetail();
  }, [username]);

  const fetchDetail = async () => {
    const [{ data: detailData }, { data: correct }, { data: incorrect }] = await Promise.all([
      supabase.rpc('get_student_detail', { p_username: username }),
      supabase.rpc('get_student_correct_questions', { p_username: username }),
      supabase.rpc('get_student_incorrect_questions', { p_username: username }),
    ]);

    setDetail(detailData?.[0] ?? null);
    setCorrectQuestions(correct ?? []);
    setIncorrectQuestions(incorrect ?? []);
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  const capitalize = (text: string | null | undefined) =>
  text ? text.charAt(0).toUpperCase() + text.slice(1) : '';

    const mathCorrect = correctQuestions.filter((q) => q.subject === 'math');
    const mathIncorrect = incorrectQuestions
    .filter((q) => q.subject === 'math')
    .sort((a, b) => b.times_incorrect - a.times_incorrect);
    const englishCorrect = correctQuestions.filter((q) => q.subject === 'english');
    const englishIncorrect = incorrectQuestions
    .filter((q) => q.subject === 'english')
    .sort((a, b) => b.times_incorrect - a.times_incorrect);

    console.log('English Correct:', englishCorrect);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{detail?.username ?? username}</Text>

      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.cardText}>Correct</Text>
          <Text style={styles.cardSubText}>{detail?.correct_count ?? 0} questions</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.cardText}>Incorrect</Text>
          <Text style={styles.cardSubText}>{detail?.incorrect_count ?? 0} questions</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.cardText}>Coins</Text>
          <Text style={styles.cardSubText}>{detail?.coins ?? 0} coins</Text>
        </View>
      </View>

      <Text style={styles.subjectTitle}>Math</Text>
        <View style={styles.questionsRow}>
        <View style={styles.quarterColumn}>
            <Text style={styles.sectionTitle}>Correct</Text>
            {mathCorrect.length === 0 ? (
            <Text style={styles.emptyText}>None yet</Text>
            ) : (
            mathCorrect.map((q, index) => (
                <View key={index} style={styles.card}>
                <Text style={styles.cardText}>{q.question}</Text>
                <Text style={styles.cardSubText}>{capitalize(q.difficulty)}</Text>
                </View>
            ))
            )}
        </View>

        <View style={styles.quarterColumn}>
            <Text style={styles.sectionTitle}>Incorrect</Text>
            {mathIncorrect.length === 0 ? (
            <Text style={styles.emptyText}>None yet</Text>
            ) : (
            mathIncorrect.map((q, index) => (
                <View key={index} style={styles.card}>
                <Text style={styles.cardText}>{q.question}</Text>
                <Text style={styles.cardSubText}>
                    {capitalize(q.difficulty)} | {q.times_incorrect} {q.times_incorrect === 1 ? 'time' : 'times'}
                </Text>
                </View>
            ))
            )}
        </View>
        </View>

        <Text style={styles.subjectTitle}>English</Text>
        <View style={styles.questionsRow}>
        <View style={styles.quarterColumn}>
            <Text style={styles.sectionTitle}>Correct</Text>
            {englishCorrect.length === 0 ? (
            <Text style={styles.emptyText}>None yet</Text>
            ) : (
            englishCorrect.map((q, index) => (
                <View key={index} style={styles.card}>
                <Text style={styles.cardText}>{q.question}</Text>
                <Text style={styles.cardSubText}>{capitalize(q.difficulty)}</Text>
                </View>
            ))
            )}
        </View>

        <View style={styles.quarterColumn}>
            <Text style={styles.sectionTitle}>Incorrect</Text>
            {englishIncorrect.length === 0 ? (
            <Text style={styles.emptyText}>None yet</Text>
            ) : (
            englishIncorrect.map((q, index) => (
                <View key={index} style={styles.card}>
                <Text style={styles.cardText}>{q.question}</Text>
                <Text style={styles.cardSubText}>
                    {capitalize(q.difficulty)} | {q.times_incorrect} {q.times_incorrect === 1 ? 'time' : 'times'}
                </Text>
                </View>
            ))
            )}
        </View>
        </View>
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
  questionsRow: {
    flexDirection: 'row',
    gap: 15,
  },
  subjectTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
    marginBottom: 10,
 },
    quarterColumn: {
    flex: 0.5,
 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4d3b2c',
  },
  cardSubText: {
    fontSize: 13,
    color: '#8a7f79',
    marginTop: 4,
  },
  emptyText: {
    color: 'white',
    fontStyle: 'italic',
  },
});