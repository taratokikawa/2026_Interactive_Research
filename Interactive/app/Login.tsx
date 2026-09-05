import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const { width } = useWindowDimensions();
  const isMobile = width < 700;

  const styles = isMobile ? mobileStyles : desktopStyles;

  const handleLogin = async () => {
    setError('');

    const { data: email, error: lookupError } = await supabase
      .rpc('get_email_by_username', {
        lookup_username: username,
      });

    if (lookupError || !email) {
      setError('Username not found');
      return;
    }

    const { error: loginError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (loginError) {
      setError(loginError.message);
      return;
    }

    const { data: userData } = await supabase.auth.getUser();

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userData.user?.id)
      .single();

    if (profile?.role === 'teacher') {
      router.replace('/TeacherHub');
    } else {
      const { data: surveyResults } = await supabase
        .from('learning_survey_results')
        .select('id')
        .eq('user_id', userData.user?.id)
        .limit(1);

      if (!surveyResults || surveyResults.length === 0) {
        router.replace('/Survey');
      } else {
        router.replace('/PracticeHub');
      }
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Login
      </Text>

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

      {error ? (
        <Text style={styles.error}>
          {error}
        </Text>
      ) : null}

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>
          Continue
        </Text>
      </TouchableOpacity>

    </View>
  );
}


const desktopStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE787',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
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
    maxWidth: 500,
    padding: 20,
    marginVertical: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    fontSize: 30,
  },

  error: {
    color: 'red',
    marginBottom: 10,
    fontSize: 18,
    textAlign: 'center',
  },

  button: {
    backgroundColor: '#A7C7E7',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 15,
    minWidth: 250,
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
    fontSize: 25,
    textAlign: 'center',
  },
});


/* =========================
   MOBILE
========================= */

const mobileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE787',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  title: {
    color: 'white',
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: '100%',
    maxWidth: 500,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginVertical: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    fontSize: 20,
  },

  error: {
    color: 'red',
    marginBottom: 8,
    fontSize: 16,
    textAlign: 'center',
  },

  button: {
    backgroundColor: '#A7C7E7',
    height: 60,
    width: '100%',
    maxWidth: 500,
    borderRadius: 8,
    marginTop: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
    fontSize: 22,
    textAlign: 'center',
  },
});
