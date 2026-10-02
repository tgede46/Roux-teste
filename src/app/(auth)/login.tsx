import { router } from 'expo-router';
import { LoginScreen } from '@/screens/LoginScreen';
import { useStore } from '@/store';

export default function LoginRoute() {
  const { showToast } = useStore();
  return (
    <LoginScreen
      mode="login"
      onLoggedIn={() => router.replace('/')}
      onForgot={() => router.push('/forgot')}
      onSignup={() => router.push('/signup')}
      onBackToLogin={() => router.replace('/login')}
      onForgotSent={() => {
        showToast('Mot de passe mis à jour. Connecte-toi.');
        router.replace('/login');
      }}
    />
  );
}
