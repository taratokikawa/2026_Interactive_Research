import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';
import { SURVEY_QUESTIONS, LIKERT_OPTIONS, SurveyQuestion } from '../components/surveyQuestions';

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function Survey() {
  const router = useRouter();
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setQuestions(shuffleArray(SURVEY_QUESTIONS));
  }, []);

  const handleSelect = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    setError('');

    if (Object.keys(answers).length < SURVEY_QUESTIONS.length) {
      setError('Please answer every question before submitting.');
      return;
    }

    setSubmitting(true);

    let audioScore = 0;
    let visualScore = 0;
    let readingWritingScore = 0;

    SURVEY_QUESTIONS.forEach((q) => {
      const score = answers[q.id] ?? 0;
      if (q.category === 'Audio') audioScore += score;
      else if (q.category === 'Visual') visualScore += score;
      else readingWritingScore += score;
    });

    const diagnosis =
      audioScore >= visualScore && audioScore >= readingWritingScore
        ? 'Audio'
        : visualScore >= audioScore && visualScore >= readingWritingScore
        ? 'Visual'
        : 'Reading/Writing';

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setError('You must be logged in.');
      setSubmitting(false);
      return;
    }

    const { error: insertError } = await supabase.from('learning_survey_results').insert({
      user_id: userData.user.id,
      audio_score: audioScore,
      visual_score: visualScore,
      reading_writing_score: readingWritingScore,
      diagnosis,
    });

    if (insertError) {
      setError(insertError.message);
      setSubmitting(false);
      return;
    }

    router.replace(
      `/Diagnosis?diagnosis=${diagnosis}&audio=${audioScore}&visual=${visualScore}&readingWriting=${readingWritingScore}`
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Symptom Check</Text>
      <Text style={styles.subtitle}>
        Rate each statement on how much it applies to your learning experience
      </Text>

      {questions.map((q, index) => (
        <View key={q.id} style={styles.questionBlock}>
          <Text style={styles.questionText}>
            {index + 1}. {q.text}
          </Text>
          <View style={styles.likertRow}>
            {LIKERT_OPTIONS.map((option) => {
              const selected = answers[q.id] === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.likertButton, selected && styles.likertButtonSelected]}
                  onPress={() => handleSelect(q.id, option.value)}
                >
                  <Text
                    style={[
                      styles.likertButtonText,
                      selected && styles.likertButtonTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={submitting}
      >
        <Text style={styles.buttonText}>{submitting ? 'Submitting...' : 'Submit'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFE787',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 60,
    color: 'white',
    marginVertical: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 25,
    color: '#8a7f79',
    marginBottom: 20,
    textAlign: 'center',
  },
  questionBlock: {
    width: '95%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 25,
    marginBottom: 30,
    alignItems: 'center',
  },
  questionText: {
    fontSize: 35,
    color: '#4d3b2c',
    marginBottom: 20,
  },
  likertRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  likertButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 6,
    borderWidth: 3,
    borderColor: '#A7C7E7',
    backgroundColor: '#fff',
  },
  likertButtonSelected: {
    backgroundColor: '#A7C7E7',
  },
  likertButtonText: {
    color: '#A7C7E7',
    fontSize: 25,
    fontWeight: 'bold',
  },
  likertButtonTextSelected: {
    color: 'white',
  },
  error: {
    color: 'red',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#A7C7E7',
    paddingVertical: 20,
    paddingHorizontal: 50,
    borderRadius: 6,
    marginTop: 10,
    marginBottom: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 30,
  },
});