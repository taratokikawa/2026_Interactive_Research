import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
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

type TutorRequestRow = {
  id: string;
  subject: string;
  details: string;
  proposed_start: string;
  proposed_end: string;
  status: string;
  profiles: { username: string; email: string } | null;
};

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
  const [studentLimit, setStudentLimit] = useState(18);
  const [tutorRequests, setTutorRequests] = useState<TutorRequestRow[]>([]);
  const [tutorRequestLimit, setTutorRequestLimit] = useState(3);

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

  const buildGoogleCalendarUrl = (request: TutorRequestRow) => {
    const dates = `${formatGCalDate(request.proposed_start)}/${formatGCalDate(request.proposed_end)}`;
    const text = encodeURIComponent(`Tutoring: ${request.subject}`);
    const details = encodeURIComponent(request.details ?? '');
    const guest = request.profiles?.email ? `&add=${encodeURIComponent(request.profiles.email)}` : '';

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}${guest}`;
  };

  useEffect(() => {
    fetchTutorRequests();
  }, []);

  const fetchTutorRequests = async () => {
    const { data, error } = await supabase
      .from('tutor_requests')
      .select('*, profiles:student_id(username, email)')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('fetchTutorRequests error:', error.message);
    }

    setTutorRequests(data ?? []);
  };

  const handleAccept = async (request: TutorRequestRow) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { error } = await supabase
      .from('tutor_requests')
      .update({ status: 'accepted', teacher_id: userData.user.id })
      .eq('id', request.id);

    if (error) return;

    fetchTutorRequests();
    Linking.openURL(buildGoogleCalendarUrl(request));
  };

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
        <View>
        <Text style={styles.sectionTitle}>Students ({userStats.length})</Text>

        <View style={styles.statsColumns}>
          {(() => {
            const visibleStats = userStats.slice(0, studentLimit);
            const perColumn = Math.ceil(visibleStats.length / 3);

            return [0, 1, 2].map((colIndex) => {
              const columnUsers = visibleStats.slice(
                colIndex * perColumn,
                (colIndex + 1) * perColumn
              );

              return (
                <View key={colIndex} style={styles.statColumn}>
                  {columnUsers.map((u, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.card}
                      onPress={() =>
                        router.push(`/StudentDetail?username=${u.username}`)
                      }
                    >
                      <Text style={styles.cardText}>{u.username}</Text>

                      <Text style={styles.cardSubText}>
                        Correct: {u.correct_count} | Incorrect: {u.incorrect_count} | Coins: {u.coins}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              );
            });
          })()}
        </View>

        {studentLimit < userStats.length && (
          <TouchableOpacity
            style={styles.showMoreButton}
            onPress={() => setStudentLimit((prev) => prev + 18)}
          >
            <Text style={styles.showMoreText}>Show More Students</Text>
          </TouchableOpacity>
        )}
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
                  <Text style={[styles.cardSubText, { fontStyle: 'italic' }]} numberOfLines={4}>
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
      
      <Text style={styles.sectionTitle}>Tutor Requests</Text>
        {tutorRequests.length === 0 ? (
          <Text style={styles.cardText}>No pending requests</Text>
        ) : (
          <>
            <View style={styles.tutorRequestsGrid}>
              {tutorRequests.slice(0, tutorRequestLimit).map((request) => (
                <View key={request.id} style={[styles.card, styles.tutorRequestCard]}>
                  <Text style={styles.cardText}>{request.subject}</Text>
                  <Text style={styles.cardSubText}>{request.details}</Text>
                  <Text style={styles.cardSubText}>Status: {capitalize(request.status)}</Text>
                  <Text style={styles.cardSubText}>Start: {formatReadable(request.proposed_start)}</Text>
                  <Text style={styles.cardSubText}>End: {formatReadable(request.proposed_end)}</Text>
                  <Text style={styles.cardSubText}>From: {request.profiles?.username}</Text>

                  {request.status === 'pending' && (
                    <TouchableOpacity style={styles.showMoreButton} onPress={() => handleAccept(request)}>
                      <Text style={styles.showMoreText}>Accept</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>

            {tutorRequestLimit < tutorRequests.length && (
              <TouchableOpacity
                style={styles.showMoreButton}
                onPress={() => setTutorRequestLimit((prev) => prev + 3)}
              >
                <Text style={styles.showMoreText}>Show More Requests</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      
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
  statsColumns: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
  },
  statColumn: {
    flex: 1,
  },
  showMoreButton: {
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#A7C7E7',
  },
  showMoreText: {
    color: 'white',
    fontWeight: 'bold',
  },
  acceptButton: {
    alignSelf: 'center',
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#A7C7E7',
  },
  tutorRequestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  tutorRequestCard: {
    width: '32.5%',
  },
});