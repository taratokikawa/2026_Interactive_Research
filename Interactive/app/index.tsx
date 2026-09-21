import { StyleSheet, Text, View, TouchableOpacity, Image, Modal, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [showTutorial, setShowTutorial] = useState(false);
  const { width, height } = useWindowDimensions();

  const isMobile = width < height || width < 700;

  const styles = isMobile ? mobileStyles : desktopStyles;

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
            <TouchableOpacity style={styles.modalButton} onPress={() => setShowTutorial(false)}>
              <Text style={styles.modalButtonText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.title}>The Ducktor</Text>

          <TouchableOpacity style={styles.button} onPress={() => router.push('/Login')}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => router.push('/SignUp')}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => setShowTutorial(true)}>
            <Text style={styles.buttonText}>Tutorial</Text>
          </TouchableOpacity>
        </View>

        <Image source={require('../assets/items/ducktor.png')} style={styles.duck} />
      </View>
    </View>
  );
}

const desktopStyles = StyleSheet.create({
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

const mobileStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFE787',
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  column: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    color: 'white',
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  button: {
    marginVertical: 8,
    height: 64,
    width: '80%',
    backgroundColor: '#A7C7E7',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 30,
  },
  duck: {
    width: 220,
    height: 220,
    resizeMode: 'contain',
    marginVertical: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 28,
    borderRadius: 8,
    width: '90%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 30,
    marginVertical: 15,
    textAlign: 'center',
    color: '#4d3b2c',
  },
  modalText: {
    marginVertical: 10,
    fontSize: 20,
    textAlign: 'left',
    color: '#8a7f79',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#A7C7E7',
    paddingVertical: 15,
    borderRadius: 6,
    marginTop: 15,
    width: '70%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 18,
  },
});