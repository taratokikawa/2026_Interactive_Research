import { StyleSheet, Text, View, TouchableOpacity, Image, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [showTutorial, setShowTutorial] = useState(false);

  return (
    <View style={styles.container}>
      <Modal visible={showTutorial} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
        <Text style={styles.modalTitle}>Tutorial</Text>
        <Text style={styles.modalText}>1. Press the "Sign Up" button to create an account</Text>
        <Text style={styles.modalText}>2. Complete the learning type survey</Text>
        <Text style={styles.modalText}>3. Use the recommended resources to enhance your learning</Text>
        <Text style={styles.modalText}>4. Hone skills through problems in the practice hub</Text>
        <TouchableOpacity
          style={styles.modalButton}
          onPress={() => setShowTutorial(false)}
        >
          <Text style={styles.modalButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
      </View>
    </Modal>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.title}>The Ducktor</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/Login')}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/SignUp')}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setShowTutorial(true)}
          >
            <Text style={styles.buttonText}>Tutorial</Text>
          </TouchableOpacity>
        </View>

        <Image source={require('../assets/items/ducktor.png')} style={styles.duck} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFE787',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  column: {
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 125,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    marginVertical: 10,
    height: 90,
    width: 300,
    backgroundColor: '#A7C7E7',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 40,
  },
  duck: {
    width: 500,
    height: 500,
    resizeMode: 'contain',
    marginLeft: -50,
  },
  modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},
modalBox: {
  backgroundColor: '#fff',
  padding: 50,
  borderRadius: 8,
  width: '50%',
  alignItems: 'center',
},
modalTitle: {
  fontSize: 45,
  marginBottom: 15,
  textAlign: 'center',
  color: '#4d3b2c',
},
modalText: {
  marginBottom: 20,
  fontSize: 30,
  textAlign: 'left',
  color: '#8a7f79',
  width: '100%',
},
modalButton: {
  backgroundColor: '#A7C7E7',
  paddingVertical: 15,
  borderRadius: 6,
  marginTop: 15,
  width: 250,
  alignItems: 'center',
},
modalButtonText: {
  color: 'white',
  fontSize: 30,
},
});