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
import { ClubScreen } from './src/screens/ClubScreen';
import { CreatorScreen } from './src/screens/CreatorScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { LibraryScreen } from './src/screens/LibraryScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { ProductScreen } from './src/screens/ProductScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { homeStyles } from './src/screens/homeStyles';
import { StoreProvider } from './src/store';
import { colors } from './src/theme';

type AuthMode = 'login' | 'signup' | 'forgot';
type Stack =
  | { name: 'main' }
  | { name: 'product'; id: string }
  | { name: 'creator'; id: string };

export default function App() {
  const [fontsLoaded] = useFonts({
    EBGaramond_400Regular,
    EBGaramond_500Medium,
    EBGaramond_600SemiBold,
    EBGaramond_700Bold,
  });
  const [loggedIn, setLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [tab, setTab] = useState<AppTab>('home');
  const [stack, setStack] = useState<Stack>({ name: 'main' });

  if (!fontsLoaded) {
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

  const openProduct = (id: string) => setStack({ name: 'product', id });
  const openCreator = (id: string) => setStack({ name: 'creator', id });
  const goMain = () => setStack({ name: 'main' });

  return (
    <StoreProvider>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        {loggedIn ? (
          <SafeAreaView style={homeStyles.safeArea}>
            <View style={homeStyles.body}>
              {stack.name === 'product' ? (
                <ProductScreen
                  productId={stack.id}
                  onBack={goMain}
                  onOpenCreator={openCreator}
                />
              ) : null}
              {stack.name === 'creator' ? (
                <CreatorScreen
                  creatorId={stack.id}
                  onBack={goMain}
                  onOpenProduct={openProduct}
                />
              ) : null}
              {stack.name === 'main' && tab === 'home' ? (
                <HomeScreen
                  onOpenProduct={openProduct}
                  onOpenCreator={openCreator}
                  onOpenFavorites={() => {
                    setTab('library');
                    goMain();
                  }}
                />
              ) : null}
              {stack.name === 'main' && tab === 'library' ? (
                <LibraryScreen onOpenProduct={openProduct} />
              ) : null}
              {stack.name === 'main' && tab === 'club' ? (
                <ClubScreen onOpenCreator={openCreator} />
              ) : null}
              {stack.name === 'main' && tab === 'profile' ? (
                <ProfileScreen
                  onLogout={() => {
                    setLoggedIn(false);
                    setAuthMode('login');
                    setTab('home');
                    goMain();
                  }}
                />
              ) : null}
            </View>
            {stack.name === 'main' ? (
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
            onLoggedIn={() => {
              setLoggedIn(true);
              setTab('home');
              goMain();
            }}
            onForgot={() => setAuthMode('forgot')}
            onSignup={() => setAuthMode('signup')}
            onBackToLogin={() => setAuthMode('login')}
          />
        )}
      </SafeAreaProvider>
    </StoreProvider>
  );
}
