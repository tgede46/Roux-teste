import type { ReactNode } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

type Props = Omit<PressableProps, 'children'> & {
  contentStyle?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

export function PressableScale({
  contentStyle,
  style,
  children,
  onPressIn,
  onPressOut,
  ...rest
}: Props) {
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
  }));

  return (
    <Pressable
      {...rest}
      style={style}
      onPressIn={(event) => {
        scale.set(withSpring(0.97, { damping: 18, stiffness: 420, mass: 0.4 }));
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        scale.set(withSpring(1, { damping: 16, stiffness: 280, mass: 0.4 }));
        onPressOut?.(event);
      }}
    >
      <Animated.View style={[{ width: '100%' }, contentStyle, animated]}>{children}</Animated.View>
    </Pressable>
  );
}
