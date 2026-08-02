import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { supabase } from '../lib/supabase';

export default function CorrectCountDisplay({ refreshKey, fontSize=20 }: { refreshKey?: number, fontSize?: number }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetchCount();
  }, [refreshKey]);

  const fetchCount = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      return;
    }

    const { count: total } = await supabase
      .from('completed_questions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userData.user.id);

    setCount(total ?? 0);
  };

  const displayText = count === null ? '...' : String(count);

  return (
    <Text style={[styles.count, { fontSize }]}>
      {displayText} correct
    </Text>
  );
}

const styles = StyleSheet.create({
  count: {
    fontSize: 20,
    marginVertical: 10,
    marginHorizontal: 10,
    color: '#4d3b2c',
  },
});