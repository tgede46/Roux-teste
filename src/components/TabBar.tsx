import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { usePathname, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { AccessibilityInfo, Platform, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hapticSelect } from '../haptics';
import { homeStyles as styles } from '../screens/homeStyles';
import { colors, uiFont } from '../theme';
import { PressableScale } from './PressableScale';

export type AppTab = 'home' | 'library' | 'club' | 'profile';

const TABS: {
  id: AppTab;
  href: '/' | '/library' | '/club' | '/profile';
  label: string;
  filled: keyof typeof Ionicons.glyphMap;
  outline: keyof typeof Ionicons.glyphMap;
}[] = [
  { id: 'home', href: '/', label: 'Accueil', filled: 'home', outline: 'home-outline' },
  { id: 'library', href: '/library', label: 'Bibliothèque', filled: 'albums', outline: 'albums-outline' },
  { id: 'club', href: '/club', label: 'Club', filled: 'people', outline: 'people-outline' },
  { id: 'profile', href: '/profile', label: 'Profil', filled: 'person', outline: 'person-outline' },
];

function tabFromPath(path: string): AppTab {
  if (path.startsWith('/library')) return 'library';
  if (path.startsWith('/club')) return 'club';
  if (path.startsWith('/profile')) return 'profile';
  return 'home';
}

export function TabBar() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const router = useRouter();
  const active = tabFromPath(pathname);
  const [reduceTransparency, setReduceTransparency] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    void AccessibilityInfo.isReduceTransparencyEnabled?.().then(setReduceTransparency);
    const sub = AccessibilityInfo.addEventListener?.('reduceTransparencyChanged', setReduceTransparency);
    return () => sub?.remove?.();
  }, []);

  const useGlass = Platform.OS === 'ios' && !reduceTransparency;

  return (
    <View
      pointerEvents="box-none"
      style={[styles.tabBarDock, { paddingBottom: Math.max(insets.bottom, 10) }]}
    >
      <View style={styles.tabBarShell}>
        {useGlass ? (
          <BlurView intensity={80} tint="systemChromeMaterialLight" style={styles.tabBarBlur} />
        ) : null}
        <View
          style={[
            styles.tabBarFill,
            { backgroundColor: useGlass ? colors.tabBarFill : colors.tabBarOpaque },
          ]}
        />
        <View style={styles.tabBar} accessibilityRole="tablist">
          {TABS.map((tab) => {
            const isActive = tab.id === active;
            return (
              <PressableScale
                key={tab.id}
                fillWidth={false}
                style={styles.tabItem}
                contentStyle={styles.tabItemInner}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
                accessibilityLabel={tab.label}
                onPress={() => {
                  hapticSelect();
                  router.navigate(tab.href);
                }}
              >
                <Ionicons
                  name={isActive ? tab.filled : tab.outline}
                  size={24}
                  color={isActive ? colors.tint : colors.tabInactive}
                />
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.85}
                  style={[
                    styles.tabLabel,
                    { fontFamily: uiFont },
                    isActive && { color: colors.tint },
                  ]}
                >
                  {tab.label}
                </Text>
              </PressableScale>
            );
          })}
        </View>
      </View>
    </View>
  );
}
