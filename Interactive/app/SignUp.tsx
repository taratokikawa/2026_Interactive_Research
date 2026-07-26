import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const [showWarning, setShowWarning] = useState(true);

  const handleSignUp = async () => {
    setError('');

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

    router.replace('/PracticeHub');
  };

  return (
    <View style={styles.container}>
      <Modal visible={showWarning} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <Text style={styles.modalTitle}>Choose your username carefully</Text>
          <Text style={styles.modalText}>
            Please do not include any identifiable information (like your real name) in your username.
          </Text>
          <Button title="Continue" onPress={() => setShowWarning(false)} />
        </View>
      </View>
    </Modal>
      <Text>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Sign Up" onPress={handleSignUp} />
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
  input: {
    borderWidth: 1,
    width: 200,
    margin: 10,
    padding: 8,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},
modalBox: {
  backgroundColor: '#fff',
  padding: 20,
  borderRadius: 8,
  width: 280,
  alignItems: 'center',
},
modalTitle: {
  fontWeight: 'bold',
  fontSize: 16,
  marginBottom: 10,
  textAlign: 'center',
},
modalText: {
  textAlign: 'center',
  marginBottom: 15,
},
});