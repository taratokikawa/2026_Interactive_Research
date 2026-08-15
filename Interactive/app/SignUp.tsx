import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const [showWarning, setShowWarning] = useState(true);

  const SIGNUP_KEY_REQUIRED = true;
  const SIGNUP_KEY = '2026interactiveresearch';
  const [accessKey, setAccessKey] = useState('');

  const handleSignUp = async () => {
    setError('');

    if (SIGNUP_KEY_REQUIRED && accessKey !== SIGNUP_KEY) {
      setError('Invalid access key.');
      return;
    }

    const fakeEmail = `${username}@users.noreply.app`;

    const { error: signUpError } = await supabase.auth.signUp({
      email: fakeEmail,
      password,
      options: {
        data: { username },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    router.replace('/Survey');
  };

  return (
    <View style={styles.container}>
      <Modal visible={showWarning} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <Text style={styles.modalTitle}>Voluntary Participation</Text>
          <Text style={styles.modalText}>
            There is NO requirement to navigate to the end of the questions – simply shut down the computer or close the tab.  If you feel anxiety, distress or any kind of emotional perturbation while testing the Educational Interactive, you are encouraged to STOP and END their participation in the study. 
          </Text>
          <Text style={styles.modalTitle}>Participant Confidentiality</Text>
          <Text style={styles.modalText}>
            Please do not include any identifiable information (like your real name) in your username.
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => setShowWarning(false)}>
            <Text style={styles.buttonText}>I understand</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
      <Text style={styles.title}>Sign Up</Text>
      {SIGNUP_KEY_REQUIRED && (
        <TextInput
          style={styles.input}
          placeholder="Access Key"
          value={accessKey}
          onChangeText={setAccessKey}
          autoCapitalize="none"
          placeholderTextColor="#A7C7E7"
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        placeholderTextColor="#A7C7E7"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#A7C7E7"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
       <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
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
    color: 'white',
    fontSize: 100,
    fontWeight: 'bold',
    marginBottom: 30,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: '30%',
    padding: 20,
    marginVertical: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    fontSize: 30,
  },

  error: {
    color: 'red',
    marginBottom: 10,
  },

  button: {
    backgroundColor: '#A7C7E7',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 15,
  },

  buttonText: {
    color: 'white',
    fontSize: 25,
    textAlign: 'center',
  },
  modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},
modalBox: {
  backgroundColor: '#fff',
  padding: 40,
  borderRadius: 8,
  width: "40%",
  alignItems: 'center',
},
modalTitle: {
  fontSize: 30,
  marginBottom: 15,
  textAlign: 'center',
  color: '#4d3b2c',
},
modalText: {
  marginBottom: 10,
  fontSize: 25,
  textAlign: 'center',
  color: '#8a7f79',
},
});