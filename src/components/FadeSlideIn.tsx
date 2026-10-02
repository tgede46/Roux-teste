import { useEffect, useState, type ReactNode } from 'react';
import { Animated, Easing } from 'react-native';

type Props = {
  delay?: number;
  fromY?: number;
  fromX?: number;
  children: ReactNode;
};

export function FadeSlideIn({ delay = 0, fromY = 18, fromX = 0, children }: Props) {
  const opacity = useState(() => new Animated.Value(0))[0];
  const translateY = useState(() => new Animated.Value(fromY))[0];
  const translateX = useState(() => new Animated.Value(fromX))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 420,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        delay,
        friction: 8,
        tension: 55,
        useNativeDriver: true,
      }),
      Animated.spring(translateX, {
        toValue: 0,
        delay,
        friction: 8,
        tension: 55,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay, opacity, translateX, translateY]);

  return (
    <Animated.View style={{ opacity, transform: [{ translateX }, { translateY }] }}>
      {children}
    </Animated.View>
  );
}
