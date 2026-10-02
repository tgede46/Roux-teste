import { ScrollView, Text, View } from 'react-native';
import { Avatar } from '../components/Avatar';
import { EmptyState } from '../components/EmptyState';
import { FadeSlideIn } from '../components/FadeSlideIn';
import { Group } from '../components/Group';
import { PressableScale } from '../components/PressableScale';
import { ME_CREATOR_ID, dropAuthor, dropKindLabel } from '../data';
import { hapticSelect } from '../haptics';
import { goBack, openCreator, openProduct } from '../nav';
import { useStore } from '../store';
import { homeStyles as styles } from './homeStyles';

export function NotificationsScreen() {
  const { user, memberships, notifs, readDropIds, markDropRead, markAllDropsRead, unreadDropCount, drops } =
    useStore();
  const items = drops.filter((drop) => {
    if (drop.creatorId === ME_CREATOR_ID && drop.authorEmail === user?.email) return true;
    return memberships[drop.creatorId] != null;
  });

  return (
    <ScrollView style={styles.body} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <PressableScale style={styles.headerLeft} onPress={goBack}>
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
          <Group inset={60}>
            {items.map((drop) => {
              const creator = dropAuthor(drop, user?.name);
              if (!creator) return null;
              const unread = notifs && !readDropIds.includes(drop.id);
              return (
                <PressableScale
                  key={drop.id}
                  contentStyle={[styles.dropRow, unread && styles.dropRowUnread]}
                  onPress={() => {
                    markDropRead(drop.id);
                    if (drop.productId) openProduct(drop.productId);
                    else if (drop.creatorId !== ME_CREATOR_ID) openCreator(drop.creatorId);
                  }}
                >
                  <Avatar
                    photo={'photo' in creator ? creator.photo : undefined}
                    color={creator.color}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.followName}>{drop.title}</Text>
                    <Text style={styles.followMeta}>
                      {dropKindLabel(drop.kind)} · {creator.name} · {drop.time}
                    </Text>
                  </View>
                  {unread ? <View style={styles.unreadDot} /> : null}
                  <Text style={styles.chevronSmall}>›</Text>
                </PressableScale>
              );
            })}
          </Group>
        )}
      </FadeSlideIn>
    </ScrollView>
  );
}
