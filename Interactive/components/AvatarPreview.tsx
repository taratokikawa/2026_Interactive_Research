import { useEffect, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabase';

const WORN_IMAGES: Record<string, any> = {
  worn_red_shirt: require('../assets/items/worn/worn_red_shirt.png'),
  worn_blue_shirt: require('../assets/items/worn/worn_blue_shirt.png'),
  worn_yellow_shirt: require('../assets/items/worn/worn_yellow_shirt.png'),
  worn_suit: require('../assets/items/worn/worn_suit.png'),
  worn_cap: require('../assets/items/worn/worn_cap.png'),
  worn_bow: require('../assets/items/worn/worn_bow.png'),
  worn_top_hat: require('../assets/items/worn/worn_top_hat.png'),
  worn_crown: require('../assets/items/worn/worn_crown.png'),
};

const BASE_AVATAR = require('../assets/items/duck.png');

export default function AvatarPreview({ refreshKey }: { refreshKey?: number }) {
  const [shirtKey, setShirtKey] = useState<string | null>(null);
  const [hatKey, setHatKey] = useState<string | null>(null);

  useEffect(() => {
    fetchEquipped();
  }, [refreshKey]);

  const fetchEquipped = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { data: avatar } = await supabase
      .from('user_avatar')
      .select('equipped_shirt, equipped_hat')
      .eq('user_id', userData.user.id)
      .single();

    if (!avatar) return;

    if (avatar.equipped_shirt) {
        const { data: shirtItem } = await supabase
            .from('shop_items')
            .select('worn_image_key')
            .eq('id', avatar.equipped_shirt)
            .single();
        setShirtKey(shirtItem?.worn_image_key ?? null);
        } else {
        setShirtKey(null);
        }

        if (avatar.equipped_hat) {
        const { data: hatItem } = await supabase
            .from('shop_items')
            .select('worn_image_key')
            .eq('id', avatar.equipped_hat)
            .single();
        setHatKey(hatItem?.worn_image_key ?? null);
        } else {
        setHatKey(null);
        }
  };

  return (
    <View style={styles.container}>
      <Image source={BASE_AVATAR} style={styles.layer} />
      {shirtKey && WORN_IMAGES[shirtKey] && (
        <Image source={WORN_IMAGES[shirtKey]} style={styles.layer} />
      )}
      {hatKey && WORN_IMAGES[hatKey] && (
        <Image source={WORN_IMAGES[hatKey]} style={styles.layer} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 120,
    position: 'relative',
  },
  layer: {
    position: 'absolute',
    width: 120,
    height: 120,
  },
});