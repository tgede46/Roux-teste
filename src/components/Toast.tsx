import { useEffect } from 'react';
import { Text } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useStore } from '../store';
import { homeStyles as styles } from '../screens/homeStyles';

export function ToastHost() {
  const { toast, clearToast } = useStore();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(clearToast, 2200);
    return () => clearTimeout(timer);
  }, [toast, clearToast]);

  if (!toast) return null;

  return (
    <Animated.View entering={FadeInUp.duration(180)} exiting={FadeOutUp.duration(140)} style={styles.toast}>
      <Text style={styles.toastText}>{toast.message}</Text>
    </Animated.View>
  );
}
