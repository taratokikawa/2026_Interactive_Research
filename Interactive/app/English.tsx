import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';
import CoinDisplay from '../components/CoinDisplay';

type Problem = {
  id: string;
  question: string;
  choice_a: string;
  choice_b: string;
  choice_c: string;
  choice_d: string;
  correct_answer: string;
  explanation: string;
};

const COIN_VALUES: Record<string, number> = {
  easy: 1,
  medium: 3,
  hard: 5,
};

export default function EnglishScreen() {
  const { difficulty } = useLocalSearchParams<{ difficulty: string }>();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [wrongChoices, setWrongChoices] = useState<string[]>([]);
  const [answered, setAnswered] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [coinRefresh, setCoinRefresh] = useState(0);
  const router = useRouter();
  const [completedCount, setCompletedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchProblem();
  }, [difficulty]);

  const fetchProblem = async () => {
  setLoading(true);
  setWrongChoices([]);
  setAnswered(false);
  setWasCorrect(false);

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return;

  const { data: completed } = await supabase
    .from('completed_questions')
    .select('question_id')
    .eq('user_id', userData.user.id)
    .eq('subject', 'english');

  const completedIds = completed?.map((c) => c.question_id) ?? [];

  // Total questions at this difficulty
  const { count: total } = await supabase
    .from('english_problems')
    .select('*', { count: 'exact', head: true })
    .eq('difficulty', difficulty);

  setTotalCount(total ?? 0);

  // Completed count specifically at this difficulty
  const { data: allAtDifficulty } = await supabase
    .from('english_problems')
    .select('id')
    .eq('difficulty', difficulty);

  const idsAtDifficulty = allAtDifficulty?.map((p) => p.id) ?? [];
  const completedAtDifficulty = completedIds.filter((id) =>
    idsAtDifficulty.includes(id)
  );
  setCompletedCount(completedAtDifficulty.length);

  // Exclude the question just shown (if any) so it's not immediately repeated
  const excludeIds = problem ? [...completedIds, problem.id] : completedIds;

  let query = supabase
    .from('english_problems')
    .select('*')
    .eq('difficulty', difficulty);

  if (excludeIds.length > 0) {
    query = query.not('id', 'in', `(${excludeIds.join(',')})`);
  }

  const { data, error } = await query;

  if (!error && data && data.length > 0) {
    // Found a question excluding the current one
    const randomIndex = Math.floor(Math.random() * data.length);
    setProblem(data[randomIndex]);
  } else {
    // No other options — fall back to allowing the same question again
    // (only excluding truly completed/correct ones)
    let fallbackQuery = supabase
      .from('english_problems')
      .select('*')
      .eq('difficulty', difficulty);

    if (completedIds.length > 0) {
      fallbackQuery = fallbackQuery.not('id', 'in', `(${completedIds.join(',')})`);
    }

    const { data: fallbackData, error: fallbackError } = await fallbackQuery;

    if (!fallbackError && fallbackData && fallbackData.length > 0) {
      const randomIndex = Math.floor(Math.random() * fallbackData.length);
      setProblem(fallbackData[randomIndex]);
    } else {
      setProblem(null);
    }
  }

  setLoading(false);
};

  const handleSelect = async (letter: string) => {
    if (selected) return; // lock after first try
    setSelected(letter);
    setAnswered(true);

    if (problem && letter === problem.correct_answer) {
      setWasCorrect(true);
      const amount = COIN_VALUES[difficulty] ?? 0;
      await supabase.rpc('increment_coins', { amount });
      setCoinRefresh((prev) => prev + 1);
      // mark as completed in DB
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        await supabase.from('completed_questions').insert({
          user_id: userData.user.id,
          question_id: problem.id,
          subject: 'english',
        });
        setCompletedCount((c) => c + 1);
      }
    } else {
      setWasCorrect(false);
      setWrongChoices((prev) => [...prev, letter]);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!problem) {
    return (
      <View style={styles.container}>
        <Text>You've completed all {difficulty} questions in this subject!</Text>
        <Button title="Return to Hub" onPress={() => router.replace('/PracticeHub')} />
      </View>
    );
  }

  const choices = [
    { letter: 'a', text: problem.choice_a },
    { letter: 'b', text: problem.choice_b },
    { letter: 'c', text: problem.choice_c },
    { letter: 'd', text: problem.choice_d },
  ];

  return (
    <View style={styles.container}>
      <CoinDisplay refreshKey={coinRefresh} />
      <Text style={styles.progress}>
        {completedCount} / {totalCount}
      </Text>

      <Text style={styles.question}>{problem.question}</Text>

      {choices.map((choice) => (
        <Button
          key={choice.letter}
          title={choice.text}
          onPress={() => handleSelect(choice.letter)}
          disabled={!!selected}
        />
      ))}

      {!answered && wrongChoices.length === 1 && (
        <Text style={styles.wrong}>Incorrect, try again!</Text>
      )}

      {answered && (
        <>
          <Text style={selected === problem.correct_answer ? styles.correct : styles.wrong}>
            {selected === problem.correct_answer ? 'Correct!' : 'Wrong!'}
          </Text>
          <Text style={styles.explanation}>{problem.explanation}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE787',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  question: {
    fontSize: 22, // 🔥 bigger title
    marginBottom: 15,
    textAlign: 'center',
    color: '#222',
    fontWeight: '600',
  },

  choiceButton: {
    width: '70%',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 6,
  },

  choiceText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  correct: {
    color: 'green',
    fontSize: 18,
    marginTop: 12,
    fontWeight: 'bold',
  },

  wrong: {
    color: 'red',
    fontSize: 18,
    marginTop: 12,
    fontWeight: 'bold',
  },

  explanation: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    color: '#333',
  },
    progress: {
    position: 'absolute',
    top: 65,
    right: 20,
    fontSize: 14,
    fontWeight: 'bold',
  },
});