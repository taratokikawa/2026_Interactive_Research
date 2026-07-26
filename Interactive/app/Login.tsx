import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
  setError('');

  const { data: email, error: lookupError } = await supabase
    .rpc('get_email_by_username', { lookup_username: username });

  if (lookupError || !email) {
    setError('Username not found');
    return;
  }

  const { error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (loginError) {
    setError(loginError.message);
    return;
  }

  router.replace('/PracticeHub');
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
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
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>LOGIN</Text>
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
    fontSize: 60,
    fontWeight: 'bold',
    marginBottom: 30,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: '80%',
    padding: 12,
    marginVertical: 10,
    backgroundColor: 'white',
    borderRadius: 8,
  },

  error: {
    color: 'red',
    marginBottom: 10,
  },

  button: {
    backgroundColor: '#A7C7E7',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 15,
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});