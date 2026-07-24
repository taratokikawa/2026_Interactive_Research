import { StyleSheet, Text, View, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Duck Practice</Text>
            <View style={styles.button}>
        <Button 
          title="Login" 
          color="#A7C7E7"
          onPress={() => router.push('/Login')} 
        />
      </View>

      <View style={styles.button}>
        <Button 
          title="Sign Up" 
          color="#A7C7E7"
          onPress={() => router.push('/SignUp')} 
        />
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
    title: {
    color: 'white', // 
    fontSize: 50,     // 
    fontWeight: 'bold',
    marginBottom: 20,
  },
   button: {
    marginVertical: 10, //
    width: 150, // optional: 
  },
});