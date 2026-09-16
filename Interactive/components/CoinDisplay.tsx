import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
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

  return (
    <View style={styles.coinsContainer}>
      <Image source={require('../assets/duck_coin.png')} style={styles.coinImage}/>
      <Text style={[styles.coins, { fontSize }]}>
        {coins ?? '...'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  coins: {
    marginLeft: 10,
    color: '#4d3b2c',
  },
  coinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  coinImage: {
    width: 40,
    height: 50,
    marginLeft: 10,
  },
});