import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';
import MiniAvatar from './MiniAvatar';

type LeaderboardEntry = {
  username: string;
  coins: number;
  questions_correct: number;
  shirt_worn_image_key: string | null;
  hat_worn_image_key: string | null;
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
            <MiniAvatar shirtKey={entry.shirt_worn_image_key} hatKey={entry.hat_worn_image_key} size={75} />
          <Text style={styles.username}>{entry.username}</Text>
          <Text style={styles.subtext}>{entry.questions_correct} correct | Coins: {entry.coins}</Text>
        </View>
      ))}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    width: 625,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  rank: {
    fontWeight: 'bold',
    fontSize: 50,
    marginLeft: 15,
    marginRight: 5,
  },
  username: {
    flex: 1,
    paddingTop: 8,
    fontSize: 40,
    marginLeft: 8,
  },
  subtext: {
    paddingTop: 18,
    marginRight: 15,
    fontSize: 30,
    color: '#666',
  },
});