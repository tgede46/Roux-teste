import { ScrollView, Text, View } from 'react-native';
import { Avatar } from '../components/Avatar';
import { EmptyState } from '../components/EmptyState';
import { FadeSlideIn } from '../components/FadeSlideIn';
import { PressableScale } from '../components/PressableScale';
import { DROPS, dropKindLabel, getCreator } from '../data';
import { hapticSelect } from '../haptics';
import { useStore } from '../store';
import { homeStyles as styles } from './homeStyles';

type Props = {
  onBack: () => void;
  onOpenCreator: (id: string) => void;
  onOpenProduct: (id: string) => void;
};

export function NotificationsScreen({ onBack, onOpenCreator, onOpenProduct }: Props) {
  const { memberships, notifs, readDropIds, markDropRead, markAllDropsRead, unreadDropCount } =
    useStore();
  const memberIds = Object.keys(memberships);
  const items = DROPS.filter((drop) => memberIds.includes(drop.creatorId));

  return (
    <ScrollView style={styles.body} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <PressableScale style={styles.headerLeft} onPress={onBack}>
          <Text style={styles.chevron}>‹</Text>
          <Text style={styles.brand}>Retour</Text>
        </PressableScale>
        {unreadDropCount > 0 ? (
          <PressableScale
            onPress={() => {
              hapticSelect();
              markAllDropsRead();
            }}
          >
            <Text style={styles.memberHint}>Tout lu</Text>
          </PressableScale>
        ) : null}
      </View>
      <FadeSlideIn>
        <Text style={styles.title}>Drops</Text>
        {!notifs ? (
          <Text style={styles.empty}>Notifications coupées. Tu peux les rallumer dans Profil.</Text>
        ) : null}
        {items.length === 0 ? (
          <EmptyState
            title="Aucun drop"
            body="Abonne-toi à un atelier : leurs drops arrivent ici le jour J."
          />
        ) : (
          items.map((drop) => {
            const creator = getCreator(drop.creatorId);
            if (!creator) return null;
            const unread = notifs && !readDropIds.includes(drop.id);
            return (
              <PressableScale
                key={drop.id}
                contentStyle={[styles.dropRow, unread && styles.dropRowUnread]}
                onPress={() => {
                  markDropRead(drop.id);
                  if (drop.productId) onOpenProduct(drop.productId);
                  else onOpenCreator(drop.creatorId);
                }}
              >
                <Avatar photo={creator.photo} color={creator.color} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.followName}>{drop.title}</Text>
                  <Text style={styles.followMeta}>
                    {dropKindLabel(drop.kind)} · {creator.name} · {drop.time}
                  </Text>
                </View>
                {unread ? <View style={styles.unreadDot} /> : null}
              </PressableScale>
            );
          })
        )}
      </FadeSlideIn>
    </ScrollView>
  );
}
