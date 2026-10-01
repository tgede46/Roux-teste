import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { colors } from '../theme';
import { homeStyles as styles } from '../screens/homeStyles';

export type AppTab = 'home' | 'library' | 'club' | 'profile';

const TABS: { id: AppTab; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'library', label: 'Library', icon: 'albums-outline' },
  { id: 'club', label: 'Club', icon: 'people-outline' },
  { id: 'profile', label: 'Profile', icon: 'person-outline' },
];

type Props = {
  active: AppTab;
  onChange: (tab: AppTab) => void;
};

export function TabBar({ active, onChange }: Props) {
  return (
    <View style={styles.tabBar}>
      {TABS.map((tab) => {
        const isActive = tab.id === active;
        return (
          <Pressable key={tab.id} style={styles.tabItem} onPress={() => onChange(tab.id)}>
            {isActive ? (
              <View style={styles.tabActiveIcon}>
                <Ionicons name={tab.icon} size={18} color={colors.white} />
              </View>
            ) : (
              <Ionicons name={tab.icon} size={20} color={colors.tabInactive} />
            )}
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
