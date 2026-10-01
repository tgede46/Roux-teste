import { Pressable, ScrollView, Text, View } from 'react-native';
import { FadeSlideIn } from '../components/FadeSlideIn';
import { useStore } from '../store';
import { homeStyles as styles } from './homeStyles';

type Props = {
  onLogout: () => void;
};

export function ProfileScreen({ onLogout }: Props) {
  const { favorites, owned, following } = useStore();

  return (
    <ScrollView style={styles.body} contentContainerStyle={styles.content}>
      <FadeSlideIn>
        <Text style={styles.title}>Profile</Text>
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Text style={[styles.brand, { color: '#fff', fontSize: 22 }]}>R</Text>
          </View>
          <Text style={styles.followName}>Toi · Roux</Text>
          <Text style={styles.followMeta}>Membre du club pixel</Text>
        </View>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{following.length}</Text>
            <Text style={styles.statLabel}>suivis</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{favorites.length}</Text>
            <Text style={styles.statLabel}>favoris</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{owned.length}</Text>
            <Text style={styles.statLabel}>achats</Text>
          </View>
        </View>
        <Pressable style={styles.ghostBtn} onPress={onLogout}>
          <Text style={styles.ghostBtnText}>Se déconnecter</Text>
        </Pressable>
      </FadeSlideIn>
    </ScrollView>
  );
}
