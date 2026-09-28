import React, { useEffect, useRef } from 'react';
import { Animated, Platform, Pressable, StyleProp, ViewStyle } from 'react-native';

type Props = {
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  scaleTo?: number;
  children?: React.ReactNode;
};

export default function HoverScaleButton({
  onPress,
  disabled = false,
  style,
  containerStyle,
  scaleTo = 1.05,
  children,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (value: number) => {
    Animated.spring(scale, {
      toValue: value,
      friction: 6,
      tension: 120,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  };

  useEffect(() => {
    if (disabled) animateTo(1);
  }, [disabled]);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onHoverIn={() => {
        if (!disabled) animateTo(scaleTo);
      }}
      onHoverOut={() => animateTo(1)}
      style={({ pressed }) => [containerStyle, { opacity: pressed ? 0.6 : 1 }]}
    >
      <Animated.View style={[{ flexGrow: 1 }, style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}