import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { supabase } from '../lib/supabase';

export default function CoinDisplay({ refreshKey, fontSize = 20 }: { refreshKey?: number; fontSize?: number }) {  const [coins, setCoins] = useState<number | null>(null);

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

  return <Text style={[styles.coins, { fontSize }]}>Coins: {coins ?? '...'}</Text>;
}

const styles = StyleSheet.create({
  coins: {
    marginVertical: 10,
    marginHorizontal: 10,
  },
});