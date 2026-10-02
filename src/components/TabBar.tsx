import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
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
  label: string;
  filled: keyof typeof Ionicons.glyphMap;
  outline: keyof typeof Ionicons.glyphMap;
}[] = [
  { id: 'home', label: 'Accueil', filled: 'home', outline: 'home-outline' },
  { id: 'library', label: 'Bibliothèque', filled: 'albums', outline: 'albums-outline' },
  { id: 'club', label: 'Club', filled: 'people', outline: 'people-outline' },
  { id: 'profile', label: 'Profil', filled: 'person', outline: 'person-outline' },
];

type Props = {
  active: AppTab;
  onChange: (tab: AppTab) => void;
};

export function TabBar({ active, onChange }: Props) {
  const insets = useSafeAreaInsets();
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
          <BlurView intensity={40} tint="systemMaterialLight" style={styles.tabBarBlur} />
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
                  onChange(tab.id);
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
                    isActive && styles.tabLabelActive,
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
