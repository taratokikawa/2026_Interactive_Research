import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { supabase } from '../lib/supabase';

export default function CorrectCountDisplay({ refreshKey }: { refreshKey?: number }) {
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
    <Text style={styles.count}>
      {displayText} correct
    </Text>
  );
}

const styles = StyleSheet.create({
  count: {
    fontSize: 20,
    marginVertical: 10,
    marginHorizontal: 10,
  },
});