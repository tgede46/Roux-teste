import 'react-native-gesture-handler';
import { Stack, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StatusBar as RNStatusBar, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  NotoSans_400Regular,
  NotoSans_500Medium,
  NotoSans_600SemiBold,
  NotoSans_700Bold,
  useFonts,
} from '@expo-google-fonts/noto-sans';
import { ToastHost } from '@/components/Toast';
import { StoreProvider, useStore } from '@/store';
import { colors } from '@/theme';

SplashScreen.preventAutoHideAsync();

function Splash() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontSize: 36, fontWeight: '700', color: colors.text }}>Roux</Text>
    </View>
  );
}

function SplashGate() {
  const { ready } = useStore();

  useEffect(() => {
    if (ready) {
      void SplashScreen.hideAsync();
    }
  }, [ready]);

  return null;
}

function RootNavigator() {
  const { ready, user } = useStore();

  if (!ready) {
    return <Splash />;
  }

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'default' }}>
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
      <Stack.Protected guard={!user}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    NotoSans_400Regular,
    NotoSans_500Medium,
    NotoSans_600SemiBold,
    NotoSans_700Bold,
  });

  if (!fontsLoaded) {
    return <Splash />;
  }

  return (
    <StoreProvider>
      <SafeAreaProvider>
        <RNStatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <StatusBar style="dark" />
        <SplashGate />
        <RootNavigator />
        <ToastHost />
      </SafeAreaProvider>
    </StoreProvider>
  );
}
