import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { supabase } from '../lib/supabase';
import { useRouter } from 'expo-router';

type UserStat = {
  username: string;
  correct_count: number;
  incorrect_count: number;
  coins: number;
};

type TopQuestion = {
  question: string;
  difficulty: string;
  times_correct?: number;
  times_incorrect?: number;
};

const MIN_ROWS = 18;

export default function TeacherHub() {
  const [userStats, setUserStats] = useState<UserStat[]>([]);
  const [topCorrectMath, setTopCorrectMath] = useState<TopQuestion[]>([]);
  const [topIncorrectMath, setTopIncorrectMath] = useState<TopQuestion[]>([]);
  const [topCorrectEnglish, setTopCorrectEnglish] = useState<TopQuestion[]>([]);
  const [topIncorrectEnglish, setTopIncorrectEnglish] = useState<TopQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [latestFeedback, setLatestFeedback] = useState<any | null>(null);
  const [allFeedback, setAllFeedback] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [
    { data: stats },
    { data: correctMath },
    { data: incorrectMath },
    { data: correctEnglish },
    { data: incorrectEnglish },
    { data: feedbackData },
  ] = await Promise.all([
    supabase.rpc('get_teacher_user_stats'),
    supabase.rpc('get_top_correct_math'),
    supabase.rpc('get_top_incorrect_math'),
    supabase.rpc('get_top_correct_english'),
    supabase.rpc('get_top_incorrect_english'),
    supabase.rpc('get_all_feedback'),
  ]);

    setUserStats(stats ?? []);
    setTopCorrectMath(correctMath ?? []);
    setTopIncorrectMath(incorrectMath ?? []);
    setTopCorrectEnglish(correctEnglish ?? []);
    setTopIncorrectEnglish(incorrectEnglish ?? []);
    setAllFeedback(feedbackData ?? []);
    setLatestFeedback(feedbackData?.[0] ?? null);
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  const totalUsers = userStats.length;
  const avgCorrect = totalUsers > 0
    ? (userStats.reduce((sum, u) => sum + u.correct_count, 0) / totalUsers).toFixed(1)
    : '0';
  const avgIncorrect = totalUsers > 0
    ? (userStats.reduce((sum, u) => sum + u.incorrect_count, 0) / totalUsers).toFixed(1)
    : '0';
  const avgCoins = totalUsers > 0
    ? (userStats.reduce((sum, u) => sum + u.coins, 0) / totalUsers).toFixed(1)
    : '0';

  const topCorrectUser = totalUsers > 0
    ? [...userStats].sort((a, b) => b.correct_count - a.correct_count)[0]
    : null;
  const topIncorrectUser = totalUsers > 0
    ? [...userStats].sort((a, b) => b.incorrect_count - a.incorrect_count)[0]
    : null;
  const topCoinsUser = totalUsers > 0
    ? [...userStats].sort((a, b) => b.coins - a.coins)[0]
    : null;

  const paddedStats: (UserStat | null)[] = [
    ...userStats,
    ...Array(Math.max(0, MIN_ROWS - userStats.length)).fill(null),
  ];

  const renderQuestionList = (title: string, questions: TopQuestion[], key: 'times_correct' | 'times_incorrect') => {
    const padded = [...questions, ...Array(Math.max(0, 3 - questions.length)).fill(null)];

    return (
      <View style={styles.halfColumn}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {padded.map((q, index) =>
          q ? (
            <View key={index} style={styles.card}>
              <Text style={styles.cardText}>{q.question}</Text>
              <Text style={styles.cardSubText}>
                {q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)} |{' '}
                {key === 'times_correct' ? q.times_correct : q.times_incorrect}{' '}
                {(key === 'times_correct' ? q.times_correct : q.times_incorrect) === 1 ? 'time' : 'times'}
              </Text>
            </View>
          ) : (
            <View key={index} style={[styles.card, styles.skeletonCard]}>
              <View style={styles.skeletonLine} />
              <View style={styles.skeletonLineShort} />
            </View>
          )
        )}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Teacher Hub</Text>

      <View style={styles.statsRow}>
        <View style={styles.leftColumn}>
        <Text style={styles.sectionTitle}>Students ({userStats.length})</Text>
        <View style={styles.statsColumns}>
          
          {[0, 1, 2].map((colIndex) => {
            const perColumn = Math.ceil(paddedStats.length / 3);
            const columnUsers = paddedStats.slice(colIndex * perColumn, (colIndex + 1) * perColumn);

            return (
              <View key={colIndex} style={styles.statColumn}>
                {columnUsers.map((u, index) =>
                  u ? (
                    <TouchableOpacity
                      key={index}
                      style={styles.card}
                      onPress={() => router.push(`/StudentDetail?username=${u.username}`)}
                    >
                      <Text style={styles.cardText}>{u.username}</Text>
                      <Text style={styles.cardSubText}>
                        Correct: {u.correct_count} | Incorrect: {u.incorrect_count} | Coins: {u.coins}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View key={index} style={[styles.card, styles.skeletonCard]}>
                      <View style={styles.skeletonLine} />
                      <View style={styles.skeletonLineShort} />
                    </View>
                  )
                )}
              </View>
            );
          })}
        </View>
      </View>


        <View style={styles.rightColumn}>
        <View style={styles.averagesLeadersRow}>
          <View style={styles.averageColumn}>
            <Text style={styles.sectionTitle}>Averages</Text>
            <View style={styles.card}>
              <Text style={styles.cardText}>Correct</Text>
              <Text style={styles.cardSubText}>{avgCorrect} questions</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardText}>Incorrect</Text>
              <Text style={styles.cardSubText}>{avgIncorrect} questions</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardText}>Coins</Text>
              <Text style={styles.cardSubText}>{avgCoins} coins</Text>
            </View>
          </View>

          <View style={styles.leadersColumn}>
            <Text style={styles.sectionTitle}>Leaders</Text>
            <View style={styles.card}>
              <Text style={styles.cardText}>Most Correct</Text>
              <Text style={styles.cardSubText}>
                {topCorrectUser ? `${topCorrectUser.username} | ${topCorrectUser.correct_count} questions` : '—'}
              </Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardText}>Most Incorrect</Text>
              <Text style={styles.cardSubText}>
                {topIncorrectUser ? `${topIncorrectUser.username} | ${topIncorrectUser.incorrect_count} questions` : '—'}
              </Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardText}>Most Coins</Text>
              <Text style={styles.cardSubText}>
                {topCoinsUser ? `${topCoinsUser.username} | ${topCoinsUser.coins} coins` : '—'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Feedback Forms ({allFeedback.length})</Text>
          <TouchableOpacity style={[styles.card, { height: 130 }]} onPress={() => router.push('/FeedbackDetail')}>
            {latestFeedback ? (
              <>
                <Text style={styles.cardText}>Latest Feedback</Text>
                <Text style={styles.cardSubText}>
                  Effectiveness: {latestFeedback.effectiveness_rating} | Usability: {latestFeedback.usability_rating} | Style: {latestFeedback.style_rating}
                </Text>
                {latestFeedback.comments ? (
                  <Text style={styles.cardSubText} numberOfLines={4}>
                    "{latestFeedback.comments}"
                  </Text>
                ) : null}
              </>
            ) : (
              <Text style={styles.cardText}>No feedback submitted yet.</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      </View>
      
      
      
      <Text style={styles.sectionTitle}>Math</Text>
      <View style={styles.pairRow}>
        {renderQuestionList('Top 3 Correct', topCorrectMath, 'times_correct')}
        {renderQuestionList('Top 3 Incorrect', topIncorrectMath, 'times_incorrect')}
      </View>

      <Text style={styles.sectionTitle}>English</Text>
      <View style={styles.pairRow}>
        {renderQuestionList('Top 3 Correct', topCorrectEnglish, 'times_correct')}
        {renderQuestionList('Top 3 Incorrect', topIncorrectEnglish, 'times_incorrect')}
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
    fontSize: 50,
    color: 'white',
    marginVertical: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  statsColumns: {
    flex: 0.7,
    flexDirection: 'row',
    gap: 10,
  },
  statColumn: {
    flex: 1,
  },
  pairRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  halfColumn: {
    flex: 0.5,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    minHeight: 60,
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
  skeletonCard: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
  },
  skeletonLine: {
    width: '80%',
    height: 12,
    backgroundColor: '#ddd',
    borderRadius: 4,
  },
  skeletonLineShort: {
    width: '50%',
    height: 10,
    backgroundColor: '#ddd',
    borderRadius: 4,
    marginTop: 6,
  },
  rightColumn: {
    flex: 0.3,
    flexDirection: 'column',
  },
  averagesLeadersRow: {
    flexDirection: 'row',
    gap: 10,
  },
  averageColumn: {
    flex: 1,
  },
  leadersColumn: {
    flex: 1,
  },
  leftColumn: {
    flex: 0.7,
    marginRight: 40,
  },
  section: {
    width: '100%',
    marginTop: 20,
  },
});