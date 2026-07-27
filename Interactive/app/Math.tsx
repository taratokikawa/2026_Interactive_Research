import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Button,
} from 'react-native';
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

export default function MathScreen() {
  const { difficulty } = useLocalSearchParams<{ difficulty: string }>();
  const router = useRouter();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [wrongChoices, setWrongChoices] = useState<string[]>([]);
  const [answered, setAnswered] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [coinRefresh, setCoinRefresh] = useState(0);
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
    setSelected(null);

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { data: completed } = await supabase
      .from('completed_questions')
      .select('question_id')
      .eq('user_id', userData.user.id)
      .eq('subject', 'math');

    const completedIds = completed?.map((c) => c.question_id) ?? [];

    // Total questions at this difficulty
    const { count: total } = await supabase
      .from('math_problems')
      .select('*', { count: 'exact', head: true })
      .eq('difficulty', difficulty);

    setTotalCount(total ?? 0);

    // Completed count specifically at this difficulty
    const { data: allAtDifficulty } = await supabase
      .from('math_problems')
      .select('id')
      .eq('difficulty', difficulty);

    const idsAtDifficulty = allAtDifficulty?.map((p) => p.id) ?? [];
    const completedAtDifficulty = completedIds.filter((id) =>
      idsAtDifficulty.includes(id)
    );
    setCompletedCount(completedAtDifficulty.length);

    const excludeIds = problem ? [...completedIds, problem.id] : completedIds;

    let query = supabase
      .from('math_problems')
      .select('*')
      .eq('difficulty', difficulty);

    if (excludeIds.length > 0) {
      query = query.not('id', 'in', `(${excludeIds.join(',')})`);
    }

    const { data, error } = await query;

    if (!error && data && data.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.length);
      setProblem(data[randomIndex]);
    } else {
      let fallbackQuery = supabase
        .from('math_problems')
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
    if (answered || wrongChoices.includes(letter) || !problem) return;

    if (letter === problem.correct_answer) {
      setSelected(letter);
      setWasCorrect(true);
      setAnswered(true);
      setCompletedCount((prev) => prev + 1);

      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        const { error: insertError } = await supabase.from('completed_questions').insert({
          user_id: userData.user.id,
          subject: 'math',
          question_id: problem.id,
        });

        if (insertError) {
          console.error('Insert failed:', insertError.message);
        }

        const amount = COIN_VALUES[difficulty] ?? 0;
        await supabase.rpc('increment_coins', { amount });
        setCoinRefresh((prev) => prev + 1);
      }
      return;
    }

    const newWrongChoices = [...wrongChoices, letter];
    setWrongChoices(newWrongChoices);

    if (newWrongChoices.length >= 2) {
      setSelected(letter);
      setWasCorrect(false);
      setAnswered(true);
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

      {choices.map((choice) => {
        const isCorrect = choice.letter === problem.correct_answer;
        const isSelected = choice.letter === selected;

        let backgroundColor = '#4DA8DA'; // default blue

        if (answered) {
          if (isCorrect) backgroundColor = '#4CAF50'; // green
          else if (isSelected) backgroundColor = '#F44336'; // red
          else backgroundColor = '#ccc'; // gray
        } else if (wrongChoices.includes(choice.letter)) {
          backgroundColor = '#ccc'; // gray out previously wrong picks, but don't reveal correct one yet
        }

        return (
          <TouchableOpacity
            key={choice.letter}
            style={[styles.choiceButton, { backgroundColor }]}
            onPress={() => handleSelect(choice.letter)}
            disabled={answered || wrongChoices.includes(choice.letter)}
          >
            <Text style={styles.choiceText}>{choice.text}</Text>
          </TouchableOpacity>
        );
      })}

      {!answered && wrongChoices.length === 1 && (
        <Text style={styles.wrong}>Incorrect, try again!</Text>
      )}

      {answered && (
        <>
          <Text
            style={
              selected === problem.correct_answer
                ? styles.correct
                : styles.wrong
            }
          >
            {selected === problem.correct_answer ? 'Correct!' : 'Wrong!'}
          </Text>

          <Text style={styles.explanation}>
            {problem.explanation}
          </Text>

          <TouchableOpacity style={styles.continueButton} onPress={fetchProblem}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
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
    fontSize: 20,
    marginBottom: 15,
    textAlign: 'center',
    color: '#white',
    fontWeight: '600',
  },

  choiceButton: {
    width: '70%',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#A7C7E7',
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
    color: '#white',
  },
  progress: {
    position: 'absolute',
    top: 65,
    right: 20,
    fontSize: 14,
    fontWeight: 'bold',
  },
  continueButton: {
    marginTop: 12,
    backgroundColor: '#A7C7E7',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});