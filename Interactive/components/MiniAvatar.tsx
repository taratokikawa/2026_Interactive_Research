import { View, Image, StyleSheet } from 'react-native';

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

type Props = {
  shirtKey?: string | null;
  hatKey?: string | null;
  size?: number;
};

export default function MiniAvatar({ shirtKey, hatKey, size = 40 }: Props) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Image source={BASE_AVATAR} style={[styles.layer, { width: size, height: size }]} />
      {shirtKey && WORN_IMAGES[shirtKey] && (
        <Image source={WORN_IMAGES[shirtKey]} style={[styles.layer, { width: size, height: size }]} />
      )}
      {hatKey && WORN_IMAGES[hatKey] && (
        <Image source={WORN_IMAGES[hatKey]} style={[styles.layer, { width: size, height: size }]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  layer: {
    position: 'absolute',
  },
});