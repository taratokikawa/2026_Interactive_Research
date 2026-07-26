import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import CoinDisplay from '../components/CoinDisplay';
import MiniLeaderboard from '../components/MiniLeaderboard';

export default function PracticeHub() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Practice Hub</Text>

      <View style={styles.row}>
        {/* Math Section */}
        <View style={styles.column}>
          <Text style={styles.sectionTitle}>Math</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/Math?difficulty=easy')}
          >
            <Text style={styles.buttonText}>EASY</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/Math?difficulty=medium')}
          >
            <Text style={styles.buttonText}>MEDIUM</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/Math?difficulty=hard')}
          >
            <Text style={styles.buttonText}>HARD</Text>
          </TouchableOpacity>
        </View>

        {/* English Section */}
        <View style={styles.column}>
          <Text style={styles.sectionTitle}>English</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/English?difficulty=easy')}
          >
            <Text style={styles.buttonText}>EASY</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/English?difficulty=medium')}
          >
            <Text style={styles.buttonText}>MEDIUM</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/English?difficulty=hard')}
          >
            <Text style={styles.buttonText}>HARD</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.title}>Leaderboard</Text>
              <MiniLeaderboard />

      <Text style={styles.title}>Profile</Text>
      <CoinDisplay />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE787',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 40,
    color: 'white',
    marginVertical: 20,
    fontWeight: 'bold',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },

  column: {
    alignItems: 'center',
  },

  button: {
    backgroundColor: '#A7C7E7',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 6,
    marginVertical: 5,
    minWidth: 100,
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});