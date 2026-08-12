import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { DIAGNOSIS_CONTENT } from '../components/diagnosisContent';
import { PRESCRIPTION_CONTENT } from '../components/prescriptionContent';

export default function Diagnosis() {
  const { diagnosis } = useLocalSearchParams<{ diagnosis: string }>();
  const router = useRouter();

  const tips = PRESCRIPTION_CONTENT[diagnosis ?? ''] ?? [];

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.mainRow}>
        <View style={styles.leftColumn}>
            <Text style={styles.title}>Diagnosis</Text>
            <Text style={styles.diagnosisText}>{diagnosis} Learner</Text>
            <Text style={styles.subtitle}>Summary</Text>
                <Text style={styles.description}>{DIAGNOSIS_CONTENT[diagnosis ?? '']?.explanation ?? ''}</Text>
            <Text style={styles.subtitle}>Sources</Text>
                <Text style={styles.description}>{DIAGNOSIS_CONTENT[diagnosis ?? '']?.sources ?? ''}</Text>
        </View>

        <View style={styles.rightColumn}>
            <Text style={styles.title}>Prescription</Text>

            {tips.map((tip, index) => (
            <View key={index} style={styles.card}>
                <Text style={styles.cardTitle}>{tip.title}</Text>
                <Text style={styles.cardSubtext}>{tip.explanation}</Text>
            </View>
            ))}
        </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => router.replace('/PracticeHub')}>
        <Text style={styles.buttonText}>Continue to Practice Hub</Text>
        </TouchableOpacity>
<Text style={styles.disclaimer}>
  <Text style={styles.disclaimerBold}>Disclaimer: </Text>
  This assessment does not constitute medical, psychological, or professional educational advice. Results are derived from a self-reported survey and do not represent a clinical diagnosis by a licensed physician, psychologist, or educational specialist.
</Text>
    </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFE787',
    alignItems: 'center',
    padding: 50,
  },
  title: {
    fontSize: 50,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  diagnosisText: {
    fontSize: 32,
    color: '#4d3b2c',
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    color: '#4d3b2c',
    textAlign: 'left',
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'left',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    width: '100%',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4d3b2c',
  },
  cardSubtext: {
    fontSize: 14,
    color: '#8a7f79',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#A7C7E7',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 6,
    marginTop: 20,
    marginBottom: 30,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  mainRow: {
  flexDirection: 'row',
  width: '100%',
},
leftColumn: {
  flex: 0.5,
  paddingRight: 15,
},
rightColumn: {
  flex: 0.5,
  paddingLeft: 15,
},
disclaimer:{
    fontSize: 25,
    color: '#fff',
    textAlign: 'left',
    marginTop: 20,
},
disclaimerBold:{
    fontWeight: 'bold',
},
});