import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { supabase } from '../lib/supabase';

export default function CoinDisplay({ refreshKey }: { refreshKey?: number }) {
  const [coins, setCoins] = useState<number | null>(null);

  useEffect(() => {
    fetchCoins();
  }, [refreshKey]);

  const fetchCoins = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { data } = await supabase
      .from('profiles')
      .select('coins')
      .eq('id', userData.user.id)
      .single();

    if (data) setCoins(data.coins);
  };

  return <Text style={styles.coins}>Coins: {coins ?? '...'}</Text>;
}

const styles = StyleSheet.create({
  coins: {
    position: 'absolute',
    top: 40,
    right: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
});