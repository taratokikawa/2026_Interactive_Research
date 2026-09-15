import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';
import CoinDisplay from '../components/CoinDisplay';
import TutorChat from '../components/TutorChat';
import { useHighlights, HighlightedText, AnnotateControls } from '../components/Highlight';
import React from 'react';
import * as Speech from 'expo-speech';

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
  easy: 5,
  medium: 10,
  hard: 25,
};

export default function EnglishScreen() {
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

  const [showChat, setShowChat] = useState(false);
  const highlight = useHighlights(problem?.id ?? '');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [rate, setRate] = useState(1.0);

  useEffect(() => {
    fetchProblem();
  }, [difficulty]);

  

  const fetchProblem = async () => {
    setLoading(true);
    setWrongChoices([]);
    setAnswered(false);
    setWasCorrect(false);
    setSelected(null);
    setShowChat(false);

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { data: completed } = await supabase
      .from('completed_questions')
      .select('question_id')
      .eq('user_id', userData.user.id)
      .eq('subject', 'english');

    const completedIds = completed?.map((c) => c.question_id) ?? [];

    const { count: total } = await supabase
      .from('english_problems')
      .select('*', { count: 'exact', head: true })
      .eq('difficulty', difficulty);

    setTotalCount(total ?? 0);

    const { data: allAtDifficulty } = await supabase
      .from('english_problems')
      .select('id')
      .eq('difficulty', difficulty);

    const idsAtDifficulty = allAtDifficulty?.map((p) => p.id) ?? [];
    const completedAtDifficulty = completedIds.filter((id) =>
      idsAtDifficulty.includes(id)
    );
    setCompletedCount(completedAtDifficulty.length);

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
      const randomIndex = Math.floor(Math.random() * data.length);
      setProblem(data[randomIndex]);
    } else {
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
          subject: 'english',
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

    const { data: userData } = await supabase.auth.getUser();
    if (userData.user && problem) {
      await supabase.from('incorrect_attempts').insert({
        user_id: userData.user.id,
        subject: 'english',
        question_id: problem.id,
      });
    }

    if (newWrongChoices.length >= 2) {
      setSelected(letter);
      setWasCorrect(false);
      setAnswered(true);
    }
  };

  useEffect(() => {
    Speech.stop();
    setIsSpeaking(false);
  }, [problem?.id]);

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const handleSpeak = () => {
    if (!problem) return;

    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    Speech.speak(problem.question, {
      language: 'en-US',
      pitch: 1.0,
      rate,
      voice: "urn:moz-tts:osx:com.apple.voice.compact.en-US.Samantha",
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
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
        <Text style={styles.title}>You've completed all {difficulty} questions!</Text>
        <TouchableOpacity style={styles.continueButton} onPress={() => router.replace('/PracticeHub')}>
          <Text style={styles.buttonText}>Return to Hub</Text>
        </TouchableOpacity>
      </View>
    );
  }

const choices = [
    { letter: 'a', text: problem.choice_a },
    { letter: 'b', text: problem.choice_b },
    { letter: 'c', text: problem.choice_c },
    { letter: 'd', text: problem.choice_d },
  ];

const mainContent = (
  <>
    <View style={styles.questionColumn}>
      <HighlightedText
        text={problem.question}
        highlights={highlight.highlights}
        onWordPress={highlight.handleWordPress}
        style={styles.question}
      />
    </View>

    <View style={styles.feedbackButtonRow}>
      <View style={styles.speakRow}>
      <TouchableOpacity style={styles.chatToggleButton} onPress={handleSpeak}>
        <Image
          source={require('../assets/speech.png')}
          style={styles.icon}
        />
      </TouchableOpacity>
        <TouchableOpacity
          style={styles.rateButton}
          onPress={() => setRate((r) => Math.max(0.5, r - 0.25))}
        >
          <Text style={styles.rateButtonText}>Slower</Text>
        </TouchableOpacity>
        <Text style={styles.rateButtonText}>{rate.toFixed(2)}x</Text>
        <TouchableOpacity
          style={styles.rateButton}
          onPress={() => setRate((r) => Math.min(1.5, r + 0.25))}
        >
          <Text style={styles.rateButtonText}>Faster</Text>
        </TouchableOpacity>
      </View>
      {!showChat && (
        <TouchableOpacity style={styles.chatToggleButton} onPress={() => setShowChat(true)}>
          <Image
            source={require('../assets/typing.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      )}
      <AnnotateControls
        showTools={highlight.showTools}
        toggleShowTools={highlight.toggleShowTools}
        activeColor={highlight.activeColor}
        setActiveColor={highlight.setActiveColor}
        onUndo={highlight.handleUndo}
        canUndo={highlight.canUndo}
      />
    </View>

    <View style={styles.choicesColumn}>
      {choices.map((choice) => {
        const isCorrect = choice.letter === problem.correct_answer;
        const isSelected = choice.letter === selected;

        let backgroundColor = '#A7C7E7';

        if (answered) {
          if (isCorrect) backgroundColor = '#4CAF50';
          else if (isSelected) backgroundColor = '#F44336';
          else backgroundColor = '#ccc';
        } else if (wrongChoices.includes(choice.letter)) {
          backgroundColor = '#ccc';
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
    </View>

    <View style={styles.feedbackColumn}>
      {!answered && wrongChoices.length === 1 && (
        <Text style={styles.wrong}>Incorrect, try again!</Text>
      )}

      {answered && (
        <>
          <Text style={selected === problem.correct_answer ? styles.correct : styles.wrong}>
            {selected === problem.correct_answer ? 'Correct!' : 'Wrong!'}
          </Text>

          <Text style={styles.explanation}>
            {problem.explanation.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {'\n'}
              </React.Fragment>
            ))}
          </Text>

          <TouchableOpacity style={styles.continueButton} onPress={fetchProblem}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  </>
);


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topBar}>
        <CoinDisplay refreshKey={coinRefresh} fontSize={40} />
        <Text style={styles.progress}>
          {completedCount} / {totalCount} Questions Completed
        </Text>
      </View>

    {showChat ? (
    <View style={styles.outerRow}>
        <View style={[styles.mainRow, styles.mainRowShrunk]}>{mainContent}</View>

        <TutorChat
          problem={problem}
          subject="English"
          onClose={() => setShowChat(false)}
        />
        </View>
      ) : (
          <View style={styles.mainRow}>{mainContent}</View>
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progress: {
    fontSize: 50,
    fontWeight: 'bold',
    color: 'white',
  },
  title: {
    fontSize: 40,
    color: 'white',
    marginVertical: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
  },
  question: {
    fontSize: 45,
    marginBottom: 10,
    textAlign: 'center',
    color: '#4d3b2c',
  },
  choiceButton: {
    width: '48%',
    minHeight: 100,
    padding: 14,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#A7C7E7',
    marginVertical: 10,
  },
  choiceText: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    flexShrink: 1,
  },
  correct: {
    color: 'green',
    fontSize: 50,
    marginTop: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  wrong: {
    color: 'red',
    fontSize: 50,
    marginVertical: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  explanation: {
    fontSize: 40,
    marginVertical: 8,
    textAlign: 'center',
    color: '#4d3b2c',
  },
  buttonText: {
    color: 'white',
    fontSize: 40,
  },
  mainRow: {
    flexDirection: 'column',
    padding: 30,
  },
  questionColumn: {
    alignItems: 'center',
    marginBottom: 20,
  },
  choicesColumn: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  feedbackColumn: {
    alignItems: 'center',
    marginTop: 20,
  },
  outerRow: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'stretch',
    height: 800,
  },
  mainRowShrunk: {
    flex: 0.66,
  },
  feedbackButtonRow: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 12,
  },
  chatToggleButton: {
    backgroundColor: '#8a7f79',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 50,
    justifyContent: 'center',
  },
  continueButton: {
    backgroundColor: '#A7C7E7',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 6,
  },
  speakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rateButton: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  rateButtonText: {
    color: '#4d3b2c',
    fontSize: 15,
  },
  icon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
});