import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabase';

type Props = {
  refreshKey: number;
  fontSize?: number;
};

export default function StreakDisplay({ refreshKey, fontSize = 24 }: Props) {
  const [streak, setStreak] = useState<number | null>(null);

  useEffect(() => {
    fetchStreak();
  }, [refreshKey]);

  const fetchStreak = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('current_streak')
      .eq('id', userData.user.id)
      .single();

    if (error) {
      console.error('fetchStreak error:', error.message);
      return;
    }

    setStreak(data?.current_streak ?? 0);
  };

  if (streak === null) return null;

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/flame.png')}
        style={styles.flameIcon}
      />
      <Text style={[styles.streakText, { fontSize }]}>{streak} days</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  flameIcon: {
    width: 35,
    height: 40,
  },
  streakText: {
    color: '#4d3b2c',
  },
});