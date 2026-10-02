import { useState } from 'react';
import {
  EBGaramond_400Regular,
  EBGaramond_500Medium,
  EBGaramond_600SemiBold,
  EBGaramond_700Bold,
  useFonts,
} from '@expo-google-fonts/eb-garamond';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { TabBar, type AppTab } from './src/components/TabBar';
import { ToastHost } from './src/components/Toast';
import { ClubScreen } from './src/screens/ClubScreen';
import { CreatorScreen } from './src/screens/CreatorScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { LibraryScreen } from './src/screens/LibraryScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { ProductScreen } from './src/screens/ProductScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { homeStyles } from './src/screens/homeStyles';
import { StoreProvider, useStore } from './src/store';
import { colors } from './src/theme';

type AuthMode = 'login' | 'signup' | 'forgot';
type Route = { name: 'product'; id: string } | { name: 'creator'; id: string };

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
      <Text style={{ fontSize: 36, fontWeight: '800', color: colors.text }}>Roux</Text>
    </View>
  );
}

function AppShell() {
  const { ready, user, login, logout, showToast } = useStore();
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [tab, setTab] = useState<AppTab>('home');
  const [stack, setStack] = useState<Route[]>([]);

  const current = stack[stack.length - 1];
  const goMain = () => setStack([]);
  const pop = () => setStack((routes) => routes.slice(0, -1));
  const openProduct = (id: string) =>
    setStack((routes) => {
      const last = routes[routes.length - 1];
      if (last?.name === 'product' && last.id === id) return routes;
      return [...routes, { name: 'product', id }];
    });
  const openCreator = (id: string) =>
    setStack((routes) => {
      const last = routes[routes.length - 1];
      if (last?.name === 'creator' && last.id === id) return routes;
      return [...routes, { name: 'creator', id }];
    });
  const openLibrary = () => {
    setTab('library');
    goMain();
  };

  if (!ready) {
    return <Splash />;
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      {user ? (
        <SafeAreaView style={homeStyles.safeArea}>
          <View style={homeStyles.body}>
            {current?.name === 'product' ? (
              <ProductScreen
                productId={current.id}
                onBack={pop}
                onOpenCreator={openCreator}
                onOpenProduct={openProduct}
                onOpenLibrary={openLibrary}
              />
            ) : null}
            {current?.name === 'creator' ? (
              <CreatorScreen
                creatorId={current.id}
                onBack={pop}
                onOpenProduct={openProduct}
              />
            ) : null}
            {!current && tab === 'home' ? (
              <HomeScreen
                onOpenProduct={openProduct}
                onOpenCreator={openCreator}
                onOpenFavorites={openLibrary}
              />
            ) : null}
            {!current && tab === 'library' ? (
              <LibraryScreen
                onOpenProduct={openProduct}
                onBrowse={() => {
                  setTab('home');
                  goMain();
                }}
              />
            ) : null}
            {!current && tab === 'club' ? <ClubScreen onOpenCreator={openCreator} /> : null}
            {!current && tab === 'profile' ? (
              <ProfileScreen
                onOpenLibrary={openLibrary}
                onOpenProduct={openProduct}
                onLogout={() => {
                  logout();
                  setAuthMode('login');
                  setTab('home');
                  goMain();
                }}
              />
            ) : null}
          </View>
          {!current ? (
            <TabBar
              active={tab}
              onChange={(next) => {
                setTab(next);
                goMain();
              }}
            />
          ) : null}
        </SafeAreaView>
      ) : (
        <LoginScreen
          mode={authMode}
          onLoggedIn={(next) => {
            login(next);
            setTab('home');
            goMain();
          }}
          onForgot={() => setAuthMode('forgot')}
          onSignup={() => setAuthMode('signup')}
          onBackToLogin={() => setAuthMode('login')}
          onForgotSent={() => {
            showToast('Lien envoyé. Vérifie tes mails.');
            setAuthMode('login');
          }}
        />
      )}
      <ToastHost />
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    EBGaramond_400Regular,
    EBGaramond_500Medium,
    EBGaramond_600SemiBold,
    EBGaramond_700Bold,
  });

  if (!fontsLoaded) {
    return <Splash />;
  }

  return (
    <StoreProvider>
      <SafeAreaProvider>
        <AppShell />
      </SafeAreaProvider>
    </StoreProvider>
  );
}
