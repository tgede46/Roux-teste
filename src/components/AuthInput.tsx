import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState, type ComponentProps } from 'react';
import { Animated, Pressable, Text, TextInput, View } from 'react-native';
import { loginStyles as styles } from '../screens/loginStyles';
import { colors } from '../theme';
import { FadeSlideIn } from './FadeSlideIn';

type Props = {
  label: string;
  delay: number;
  shake: Animated.Value;
  isPassword?: boolean;
  error?: string | null;
} & ComponentProps<typeof TextInput>;

export function AuthInput({
  label,
  delay,
  shake,
  isPassword = false,
  error,
  ...inputProps
}: Props) {
  const [focused, setFocused] = useState(false);
  const [passwordHidden, setPasswordHidden] = useState(true);
  const focusAnim = useState(() => new Animated.Value(0))[0];

  useEffect(() => {
    Animated.spring(focusAnim, {
      toValue: focused ? 1 : 0,
      friction: 7,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, [focused, focusAnim]);

  const scale = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.015],
  });

  const shakeX = shake.interpolate({
    inputRange: [-1, -0.5, 0, 0.5, 1],
    outputRange: [-8, 6, 0, -6, 8],
  });

  return (
    <FadeSlideIn delay={delay}>
      <View style={styles.field}>
        <Text style={styles.label}>{label}</Text>
        <Animated.View
          style={[
            styles.inputWrap,
            focused && styles.inputWrapFocused,
            !!error && styles.inputWrapError,
            { transform: [{ translateX: shakeX }, { scale }] },
          ]}
        >
          <View style={styles.inputRow}>
            <TextInput
              {...inputProps}
              placeholderTextColor={colors.placeholder}
              secureTextEntry={isPassword ? passwordHidden : inputProps.secureTextEntry}
              onFocus={(event) => {
                setFocused(true);
                inputProps.onFocus?.(event);
              }}
              onBlur={(event) => {
                setFocused(false);
                inputProps.onBlur?.(event);
              }}
              style={[styles.input, isPassword && styles.inputWithToggle]}
            />
            {isPassword ? (
              <Pressable
                onPress={() => setPasswordHidden((hidden) => !hidden)}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={
                  passwordHidden ? 'Afficher le mot de passe' : 'Masquer le mot de passe'
                }
                style={styles.togglePassword}
              >
                <Ionicons
                  name={passwordHidden ? 'eye-outline' : 'eye-off-outline'}
                  size={22}
                  color={colors.text}
                />
              </Pressable>
            ) : null}
          </View>
        </Animated.View>
        {error ? <Text style={styles.fieldError}>{error}</Text> : null}
      </View>
    </FadeSlideIn>
  );
}
