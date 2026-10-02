import { useEffect } from 'react';
import { Text } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../store';
import { homeStyles as styles } from '../screens/homeStyles';

export function ToastHost() {
  const { toast, clearToast } = useStore();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(clearToast, 2200);
    return () => clearTimeout(timer);
  }, [toast, clearToast]);

  if (!toast) return null;

  return (
    <Animated.View
      entering={FadeInUp.duration(180)}
      exiting={FadeOutUp.duration(140)}
      style={[styles.toast, { top: insets.top + 8 }]}
    >
      <Text style={styles.toastText}>{toast.message}</Text>
    </Animated.View>
  );
}
