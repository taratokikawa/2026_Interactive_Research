import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';
import MiniAvatar from '../components/MiniAvatar';

type LeaderboardEntry = {
  username: string;
  coins: number;
  questions_correct: number;
  shirt_worn_image_key: string | null;
  hat_worn_image_key: string | null;
};

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const MIN_REST_ROWS = 7; 

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    const { data, error } = await supabase.rpc('get_leaderboard');

    if (!error && data) {
      setEntries(data);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  const topThree = entries.slice(0, 3);
  const realRest = entries.slice(3);

  const restSlots: (LeaderboardEntry | null)[] = [
    ...realRest,
    ...Array(Math.max(0, MIN_REST_ROWS - realRest.length)).fill(null),
  ];

  // Pad topThree with nulls so we always render 3 slots, using skeletons for missing users
  const topThreeSlots: (LeaderboardEntry | null)[] = [
    topThree[0] ?? null,
    topThree[1] ?? null,
    topThree[2] ?? null,
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>

      <View style={styles.topRow}>
        {topThreeSlots.map((entry, index) => {
        const medalStyle =
          index === 0 ? styles.goldBorder : index === 1 ? styles.silverBorder : styles.bronzeBorder;

        return entry ? (
          <View key={index} style={[styles.topCard, medalStyle]}>
            <Text style={styles.rank}>{index + 1}.</Text>
            <View style={styles.cardContentRow}>
              <MiniAvatar shirtKey={entry.shirt_worn_image_key} hatKey={entry.hat_worn_image_key} size={200} />
              <View style={styles.infoColumn}>
                <Text style={styles.bigUsername}>{entry.username}</Text>
                <Text style={styles.bigStat}>{entry.questions_correct} correct | Coins: {entry.coins}</Text>
              </View>
            </View>
          </View>
        ) : (
          <View key={index} style={[styles.topCard, styles.skeletonCard, medalStyle]}>
            <Text style={styles.rank}>{index + 1}.</Text>
            <View style={styles.skeletonAvatar} />
            <View style={styles.skeletonLine} />
            <View style={styles.skeletonLineShort} />
          </View>
        );
      })}
      </View>

      <FlatList
        data={restSlots}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) =>
          item ? (
            <View style={styles.row}>
              <View style={styles.leftGroup}>
                <Text style={styles.rank}>{index + 4}.</Text>
                <MiniAvatar shirtKey={item.shirt_worn_image_key} hatKey={item.hat_worn_image_key} size={40} />
                <Text style={styles.username}>{item.username}</Text>
              </View>
              <Text style={styles.statRight}>{item.questions_correct} correct | Coins: {item.coins}</Text>
            </View>
          ) : (
            <View style={[styles.row, styles.skeletonRow]}>
              <Text style={styles.rank}>{index + 4}.</Text>
              <View style={styles.skeletonAvatarSmall} />
              <View style={styles.skeletonLineFlex} />
              <View style={styles.skeletonLineShort} />
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE787',
    padding: 20,
  },
  title: {
    fontSize: 80,
    color: 'white',
    marginVertical: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  topCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  skeletonCard: {
    backgroundColor: '#f0f0f0',
  },
  skeletonAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ddd',
    marginVertical: 6,
  },
  skeletonLine: {
    width: '80%',
    height: 12,
    backgroundColor: '#ddd',
    borderRadius: 4,
    marginTop: 6,
  },
  skeletonLineShort: {
    width: '50%',
    height: 10,
    backgroundColor: '#ddd',
    borderRadius: 4,
    marginTop: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginVertical: 6,
  },
  rank: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#4d3b2c',
  },
  username: {
    fontSize: 25,
    color: '#4d3b2c',
  },
  bigUsername: {
    flex: 1,
    marginLeft: 8,
    fontSize: 50,
    color: '#4d3b2c',
  },
  stat: {
    fontSize: 14,
    marginLeft: 8,
    color: '#4d3b2c',
  },
  bigStat: {
    fontSize: 30,
    marginLeft: 8,
    color: '#8a7f79',
  },
  skeletonRow: {
    backgroundColor: '#f0f0f0',
  },
  skeletonAvatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ddd',
    marginLeft: 8,
  },
  skeletonLineFlex: {
    flex: 1,
    marginLeft: 8,
  },
  cardContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoColumn: {
    marginLeft: 8,
    justifyContent: 'center',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statRight: {
    fontSize: 14,
    color: '#8a7f79',
    textAlign: 'right',
  },
  goldBorder: {
    borderWidth: 4,
    borderColor: '#ecbe34',
  },
  silverBorder: {
    borderWidth: 4,
    borderColor: '#C0C0C0',
  },
  bronzeBorder: {
    borderWidth: 4,
    borderColor: '#eb9c4d',
  },
});