import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { homeStyles } from '@/screens/homeStyles';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function AppLayout() {
  return (
    <SafeAreaView style={homeStyles.safeArea} edges={['top']}>
      <Stack screenOptions={{ headerShown: false, animation: 'default', animationMatchesGesture: true }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="product/[id]" />
        <Stack.Screen name="creator/[id]" />
        <Stack.Screen name="reader/[id]" />
        <Stack.Screen name="notifs" />
        <Stack.Screen
          name="studio"
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
      </Stack>
    </SafeAreaView>
  );
}
