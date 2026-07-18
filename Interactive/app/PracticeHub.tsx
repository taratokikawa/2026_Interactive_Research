import { StyleSheet, Text, View, Button } from 'react-native';
import { useRouter } from 'expo-router';
import CoinDisplay from '../components/CoinDisplay';

export default function PracticeHub() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Practice Hub</Text>

      <View style={styles.row}>
        <View style={styles.column}>
          <Text>Math</Text>
          <Button title="Easy" onPress={() => router.push('/Math?difficulty=easy')} />
          <Button title="Medium" onPress={() => router.push('/Math?difficulty=medium')} />
          <Button title="Hard" onPress={() => router.push('/Math?difficulty=hard')} />
        </View>

        <View style={styles.column}>
          <Text>English</Text>
          <Button title="Easy" onPress={() => router.push('/English?difficulty=easy')} />
          <Button title="Medium" onPress={() => router.push('/English?difficulty=medium')} />
          <Button title="Hard" onPress={() => router.push('/English?difficulty=hard')} />
        </View>
      </View>

      <Text style={styles.title}>Leaderboard</Text>
      <Button title="Coming Soon" onPress={() => {}} />

      <Text style={styles.title}>Profile</Text>
      <CoinDisplay />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    marginVertical: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  column: {
    alignItems: 'center',
    gap: 8,
  },
});