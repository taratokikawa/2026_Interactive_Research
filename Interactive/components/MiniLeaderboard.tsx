import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';

type LeaderboardEntry = {
  username: string;
  coins: number;
  questions_correct: number;
};

export default function MiniLeaderboard() {
  const router = useRouter();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTop3();
  }, []);

  const fetchTop3 = async () => {
    const { data, error } = await supabase.rpc('get_leaderboard');

    if (!error && data) {
      setEntries(data.slice(0, 3));
    }

    setLoading(false);
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <TouchableOpacity style={styles.container} onPress={() => router.push('/Leaderboard')}>
      {entries.map((entry, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.rank}>{index + 1}.</Text>
          <Text style={styles.username}>{entry.username}</Text>
          <Text>{entry.questions_correct} correct | </Text>
          <Text>Coins: {entry.coins}</Text>
        </View>
      ))}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    width: 250,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  rank: {
    fontWeight: 'bold',
  },
  username: {
    flex: 1,
    marginLeft: 8,
  },
});