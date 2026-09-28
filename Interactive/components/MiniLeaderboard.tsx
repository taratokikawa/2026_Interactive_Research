import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';
import MiniAvatar from './MiniAvatar';
import HoverScaleButton from '../components/HoverScaleButton';

type LeaderboardEntry = {
  username: string;
  coins: number;
  questions_correct: number;
  shirt_worn_image_key: string | null;
  hat_worn_image_key: string | null;
  current_streak: number;
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
    <HoverScaleButton style={styles.container} onPress={() => router.push('/Leaderboard')}>
      {entries.map((entry, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.rank}>{index + 1}.</Text>
            <MiniAvatar shirtKey={entry.shirt_worn_image_key} hatKey={entry.hat_worn_image_key} size={75} />
          <Text style={styles.username}>{entry.username}</Text>
          <View style={styles.subtextContainer}>
            <Text style={styles.subtext}>
              {entry.questions_correct} correct    
            </Text>
            <Image source={require('../assets/duck_coin.png')} style={styles.coinImage} />
            <Text style={styles.subtext}>{entry.coins}</Text>
            <Image
              source={require('../assets/flame.png')}
              style={styles.flameIcon}
            />
            <Text style={styles.subtext}>{entry.current_streak}</Text>
          </View>
        </View>
      ))}
    </HoverScaleButton>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    width: 625,
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  rank: {
    fontWeight: 'bold',
    fontSize: 50,
    marginLeft: 15,
    marginRight: 5,
    color: '#4d3b2c',
  },
  username: {
    flex: 1,
    paddingTop: 15,
    fontSize: 35,
    marginLeft: 8,
    color: '#4d3b2c',
  },
  subtext: {
    marginRight: 12,
    fontSize: 22,
    color: '#8a7f79',
  },
  subtextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinImage: {
    width: 27,
    height: 35,
    marginHorizontal: 4,
  },
  flameIcon: {
    width: 27,
    height: 27,
    marginRight: 4,
  },
});