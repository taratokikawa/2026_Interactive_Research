import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
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

export default function MathScreen() {
  const { difficulty } = useLocalSearchParams<{ difficulty: string }>();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [coinRefresh, setCoinRefresh] = useState(0);

  useEffect(() => {
    fetchProblem();
  }, [difficulty]);

  const fetchProblem = async () => {
    setLoading(true);
    setSelected(null);

    const { data, error } = await supabase
      .from('math_problems')
      .select('*')
      .eq('difficulty', difficulty);

    if (!error && data && data.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.length);
      setProblem(data[randomIndex]);
    }

    setLoading(false);
  };

  const handleSelect = async (letter: string) => {
    if (selected) return; // lock after first try
    setSelected(letter);

    if (problem && letter === problem.correct_answer) {
      const amount = COIN_VALUES[difficulty] ?? 0;
      await supabase.rpc('increment_coins', { amount });
      setCoinRefresh((prev) => prev + 1);
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
        <Text>No problem found.</Text>
      </View>
    );
  }

  const choices: { letter: string; text: string }[] = [
    { letter: 'a', text: problem.choice_a },
    { letter: 'b', text: problem.choice_b },
    { letter: 'c', text: problem.choice_c },
    { letter: 'd', text: problem.choice_d },
  ];

  return (
    <View style={styles.container}>
      <CoinDisplay refreshKey={coinRefresh} />

      <Text style={styles.question}>{problem.question}</Text>

      {choices.map((choice) => (
        <Button
          key={choice.letter}
          title={choice.text}
          onPress={() => handleSelect(choice.letter)}
          disabled={!!selected}
        />
      ))}

      {selected && (
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 20,
  },
  question: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  correct: {
    color: 'green',
    fontSize: 16,
    marginTop: 10,
  },
  wrong: {
    color: 'red',
    fontSize: 16,
    marginTop: 10,
  },
  explanation: {
    fontSize: 14,
    marginTop: 6,
    textAlign: 'center',
    color: '#333',
  },
});