import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
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
      <Text>Login</Text>
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
      <Button title="Login" onPress={handleLogin} />
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
});