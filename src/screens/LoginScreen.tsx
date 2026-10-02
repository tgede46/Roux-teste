import { useEffect, useRef, useState } from 'react';
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
import { hapticError } from '../haptics';
import { useStore } from '../store';
import { validateEmail, validateName, validatePassword } from '../validation';
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
  onForgotSent,
}: {
  mode: 'login' | 'signup' | 'forgot';
  onLoggedIn: () => void;
  onForgot: () => void;
  onSignup: () => void;
  onBackToLogin: () => void;
  onForgotSent: () => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pressedLink, setPressedLink] = useState<'forgot' | 'create' | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, resetPassword } = useStore();
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const emailShake = useRef(new Animated.Value(0)).current;
  const nameShake = useRef(new Animated.Value(0)).current;
  const passwordShake = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const buttonPulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setLoading(false);
    setErrors({});
  }, [mode]);

  const onContinue = () => {
    if (loading) return;

    const next = {
      name: mode === 'signup' ? validateName(name) ?? undefined : undefined,
      email: validateEmail(email) ?? undefined,
      password: validatePassword(password) ?? undefined,
    };
    setErrors(next);

    if (next.name || next.email || next.password) {
      if (next.name) shakeField(nameShake);
      if (next.email) shakeField(emailShake);
      if (next.password) shakeField(passwordShake);
      hapticError();
      Animated.sequence([
        Animated.timing(buttonScale, { toValue: 0.97, duration: 80, useNativeDriver: true }),
        Animated.spring(buttonScale, { toValue: 1, friction: 5, useNativeDriver: true }),
      ]).start();
      return;
    }

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
    void (async () => {
      const result =
        mode === 'signup'
          ? await signUp(name.trim(), email, password)
          : mode === 'forgot'
            ? await resetPassword(email, password)
            : await signIn(email, password);
      setLoading(false);
      if (!result.ok) {
        setErrors((prev) => ({
          ...prev,
          email: result.error.includes('mot de passe') ? undefined : result.error,
          password: result.error.toLowerCase().includes('mot de passe') ? result.error : prev.password,
        }));
        if (result.error.toLowerCase().includes('mot de passe')) shakeField(passwordShake);
        else shakeField(emailShake);
        hapticError();
        return;
      }
      if (mode === 'forgot') {
        onForgotSent();
        return;
      }
      onLoggedIn();
    })();
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
              shake={nameShake}
              error={errors.name}
              value={name}
              onChangeText={(value) => {
                setName(value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              placeholder="Prénom et nom"
              autoCorrect={false}
            />
          ) : null}

          <AuthInput
            label="Email"
            delay={200}
            shake={emailShake}
            error={errors.email}
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            placeholder="toi@roux.club"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
          />

          <AuthInput
            label={mode === 'forgot' ? 'Nouveau mot de passe' : 'Mot de passe'}
            delay={280}
            shake={passwordShake}
            error={errors.password}
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            placeholder="6 caractères, lettres et chiffres"
            isPassword
            autoCapitalize="none"
            autoCorrect={false}
          />

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
                          ? 'Enregistrer'
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
            {mode === 'forgot'
              ? 'Mise à jour du mot de passe...'
              : mode === 'signup'
                ? 'Création du compte...'
                : 'Connexion...'}
          </Text>
        </View>
      ) : null}
    </SafeAreaView>
  );
}
