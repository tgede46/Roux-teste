import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthInput } from '../components/AuthInput';
import { FadeSlideIn } from '../components/FadeSlideIn';
import { loginStyles as styles } from './loginStyles';

function shakeField(anim: Animated.Value) {
  anim.setValue(0);
  Animated.sequence([
    Animated.timing(anim, { toValue: 1, duration: 50, useNativeDriver: true }),
    Animated.timing(anim, { toValue: -1, duration: 50, useNativeDriver: true }),
    Animated.timing(anim, { toValue: 1, duration: 50, useNativeDriver: true }),
    Animated.timing(anim, { toValue: -1, duration: 50, useNativeDriver: true }),
    Animated.spring(anim, { toValue: 0, friction: 5, useNativeDriver: true }),
  ]).start();
}

export function LoginScreen({
  mode,
  onLoggedIn,
  onForgot,
  onSignup,
  onBackToLogin,
}: {
  mode: 'login' | 'signup' | 'forgot';
  onLoggedIn: () => void;
  onForgot: () => void;
  onSignup: () => void;
  onBackToLogin: () => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pressedLink, setPressedLink] = useState<'forgot' | 'create' | null>(null);
  const [loading, setLoading] = useState(false);

  const emailShake = useRef(new Animated.Value(0)).current;
  const passwordShake = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const buttonPulse = useRef(new Animated.Value(0)).current;

  const onContinue = () => {
    if (loading) return;

    const emailEmpty = email.trim().length === 0;
    const passwordEmpty = mode !== 'forgot' && password.trim().length === 0;
    const nameEmpty = mode === 'signup' && name.trim().length === 0;

    if (emailEmpty || passwordEmpty || nameEmpty) {
      if (emailEmpty) shakeField(emailShake);
      if (passwordEmpty) shakeField(passwordShake);
      Animated.sequence([
        Animated.timing(buttonScale, { toValue: 0.97, duration: 80, useNativeDriver: true }),
        Animated.spring(buttonScale, { toValue: 1, friction: 5, useNativeDriver: true }),
      ]).start();
      return;
    }

    if (loading) return;

    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.96, duration: 90, useNativeDriver: true }),
      Animated.spring(buttonScale, { toValue: 1, friction: 4, tension: 120, useNativeDriver: true }),
    ]).start();

    buttonPulse.setValue(0);
    Animated.timing(buttonPulse, {
      toValue: 1,
      duration: 700,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();

    setLoading(true);
    setTimeout(onLoggedIn, 1400);
  };

  const pulseScale = buttonPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.35],
  });
  const pulseOpacity = buttonPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.28, 0],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.screen}>
          <FadeSlideIn delay={40} fromX={-16} fromY={0}>
            <Pressable
              style={styles.backRow}
              hitSlop={8}
              onPress={mode === 'login' ? undefined : onBackToLogin}
            >
              <Text style={styles.backChevron}>‹</Text>
              <Text style={styles.backLabel}>Roux</Text>
            </Pressable>
          </FadeSlideIn>

          <FadeSlideIn delay={120} fromY={12}>
            <Text style={styles.title}>
              {mode === 'signup' ? 'Créer un compte' : mode === 'forgot' ? 'Mot de passe' : 'Connexion'}
            </Text>
          </FadeSlideIn>

          {mode === 'signup' ? (
            <AuthInput
              label="Nom"
              delay={160}
              shake={emailShake}
              value={name}
              onChangeText={setName}
              placeholder="Ton nom"
              autoCorrect={false}
            />
          ) : null}

          <AuthInput
            label="Email"
            delay={200}
            shake={emailShake}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {mode !== 'forgot' ? (
            <AuthInput
              label="Mot de passe"
              delay={280}
              shake={passwordShake}
              value={password}
              onChangeText={setPassword}
              placeholder="Mot de passe"
              isPassword
              autoCapitalize="none"
              autoCorrect={false}
            />
          ) : null}

          {mode === 'login' ? (
            <FadeSlideIn delay={360}>
              <Pressable
                hitSlop={6}
                onPress={onForgot}
                onPressIn={() => setPressedLink('forgot')}
                onPressOut={() => setPressedLink(null)}
              >
                <Text style={[styles.forgot, pressedLink === 'forgot' && styles.linkPressed]}>
                  Mot de passe oublié
                </Text>
              </Pressable>
            </FadeSlideIn>
          ) : (
            <View style={{ height: 28 }} />
          )}

          <FadeSlideIn delay={440} fromY={22}>
            <View>
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.buttonPulse,
                  { opacity: pulseOpacity, transform: [{ scale: pulseScale }] },
                ]}
              />
              <Pressable
                onPressIn={() =>
                  Animated.spring(buttonScale, {
                    toValue: 0.97,
                    useNativeDriver: true,
                    friction: 7,
                  }).start()
                }
                onPressOut={() =>
                  Animated.spring(buttonScale, {
                    toValue: 1,
                    useNativeDriver: true,
                    friction: 6,
                  }).start()
                }
                onPress={onContinue}
              >
                <Animated.View style={[styles.button, { transform: [{ scale: buttonScale }] }]}>
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.buttonText}>
                      {mode === 'signup'
                        ? 'Créer mon compte'
                        : mode === 'forgot'
                          ? 'Envoyer le lien'
                          : 'Continuer'}
                    </Text>
                  )}
                </Animated.View>
              </Pressable>
            </View>
          </FadeSlideIn>

          {mode === 'login' ? (
            <FadeSlideIn delay={520}>
              <Pressable
                style={styles.createAccount}
                hitSlop={8}
                onPress={onSignup}
                onPressIn={() => setPressedLink('create')}
                onPressOut={() => setPressedLink(null)}
              >
                <Text
                  style={[
                    styles.createAccountText,
                    pressedLink === 'create' && styles.linkPressed,
                  ]}
                >
                  Créer un compte
                </Text>
              </Pressable>
            </FadeSlideIn>
          ) : null}
        </View>
      </KeyboardAvoidingView>
      {loading ? (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#111111" />
          <Text style={styles.overlayText}>
            {mode === 'forgot' ? 'Envoi du lien...' : 'Connexion...'}
          </Text>
        </View>
      ) : null}
    </SafeAreaView>
  );
}
