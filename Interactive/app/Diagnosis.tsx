import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Linking,
  useWindowDimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { DIAGNOSIS_CONTENT } from '../components/diagnosisContent';
import { PRESCRIPTION_CONTENT } from '../components/prescriptionContent';
import { LINKS_CONTENT } from '../components/linksContent';

export default function Diagnosis() {
  const { diagnosis } = useLocalSearchParams<{ diagnosis: string }>();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 700;
  const styles = isMobile ? mobileStyles : desktopStyles;

  const tips = PRESCRIPTION_CONTENT[diagnosis ?? ''] ?? [];
  const linkSections = LINKS_CONTENT[diagnosis ?? ''] ?? [];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.mainRow}>
        <View style={styles.leftColumn}>
          <Text style={styles.title}>Diagnosis</Text>
          <Text style={styles.diagnosisText}>{diagnosis} Learner</Text>

          <Text style={styles.subtitle}>Summary</Text>
          <Text style={styles.description}>
            {DIAGNOSIS_CONTENT[diagnosis ?? '']?.explanation ?? ''}
          </Text>

          <Text style={styles.subtitle}>Sources</Text>
          <Text style={styles.description}>
            {DIAGNOSIS_CONTENT[diagnosis ?? '']?.sources ?? ''}
          </Text>

          <Text style={styles.disclaimer}>
            <Text style={styles.disclaimerBold}>Disclaimer: </Text>
            This assessment does not constitute medical, psychological, or
            professional educational advice. Results are derived from a
            self-reported survey and do not represent a clinical diagnosis
            by a licensed physician, psychologist, or educational specialist.
          </Text>
        </View>

        <View style={styles.rightColumn}>
          <Text style={styles.title}>Prescription</Text>
          <Text style={styles.subtitle}>Required Practice</Text>

          {linkSections.map((section, sIndex) => (
            <View key={sIndex} style={styles.cardOutline}>
              <Text style={styles.cardTitleBig}>{section.heading}</Text>
              {section.items.map((item, iIndex) => (
                <Text key={iIndex} style={styles.cardSubtextBig}>
                  • {item.text}
                  {item.linkLabel && item.linkUrl && (
                    <Text
                      style={styles.linkText}
                      onPress={() => Linking.openURL(item.linkUrl!)}
                    >
                      {' '}{item.linkLabel}
                    </Text>
                  )}
                </Text>
              ))}
            </View>
          ))}

          <Text style={styles.subtitle}>Recommended Tools</Text>

          {tips.map((tip, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>{tip.title}</Text>
              <Text style={styles.cardSubtext}>{tip.explanation}</Text>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace('/PracticeHub')}
      >
        <Text style={styles.buttonText}>Continue to Practice Hub</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const desktopStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFE787',
    alignItems: 'center',
    paddingHorizontal: 50,
    paddingVertical: 30,
  },
  mainRow: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 1400,
  },
  leftColumn: {
    flex: 0.5,
    paddingRight: 15,
  },
  rightColumn: {
    flex: 0.5,
    paddingLeft: 15,
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
    lineHeight: 26,
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
  cardOutline: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    width: '100%',
    marginBottom: 12,
    borderWidth: 5,
    borderColor: '#A7C7E7',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4d3b2c',
  },
  cardTitleBig: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4d3b2c',
  },
  cardSubtext: {
    fontSize: 14,
    color: '#8a7f79',
    marginTop: 4,
    lineHeight: 20,
  },
  cardSubtextBig: {
    fontSize: 20,
    color: '#8a7f79',
    marginTop: 4,
    lineHeight: 28,
  },
  disclaimer: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'left',
    marginTop: 20,
    lineHeight: 28,
  },
  disclaimerBold: {
    fontWeight: 'bold',
  },
  linkText: {
    color: '#A7C7E7',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#A7C7E7',
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 6,
    marginTop: 20,
    marginBottom: 10,
    minWidth: 350,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 25,
    textAlign: 'center',
  },
});

const mobileStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFE787',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  mainRow: {
    flexDirection: 'column',
    width: '100%',
  },
  leftColumn: {
    width: '100%',
    paddingRight: 0,
  },
  rightColumn: {
    width: '100%',
    paddingLeft: 0,
    marginTop: 20,
  },
  title: {
    fontSize: 42,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  diagnosisText: {
    fontSize: 26,
    color: '#4d3b2c',
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    fontSize: 10,
    color: '#4d3b2c',
    textAlign: 'left',
    marginBottom: 15,
    lineHeight: 14,
  },
  subtitle: {
    fontSize: 25,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'left',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    width: '100%',
    marginBottom: 10,
  },
  cardOutline: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    width: '100%',
    marginBottom: 10,
    borderWidth: 4,
    borderColor: '#A7C7E7',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#4d3b2c',
  },
  cardTitleBig: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#4d3b2c',
  },
  cardSubtext: {
    fontSize: 14,
    color: '#8a7f79',
    marginTop: 4,
    lineHeight: 20,
  },
  cardSubtextBig: {
    fontSize: 16,
    color: '#8a7f79',
    marginTop: 5,
    lineHeight: 23,
  },
  disclaimer: {
    fontSize: 15,
    color: '#fff',
    textAlign: 'left',
    marginTop: 15,
    lineHeight: 21,
    marginBottom: 10,
  },
  disclaimerBold: {
    fontWeight: 'bold',
  },
  linkText: {
    color: '#A7C7E7',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#A7C7E7',
    height: 60,
    width: '100%',
    maxWidth: 500,
    borderRadius: 6,
    marginTop: 20,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
});
