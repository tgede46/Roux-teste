import { useState } from 'react';
import { Alert, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import { FadeSlideIn } from '../components/FadeSlideIn';
import { Group } from '../components/Group';
import { PressableScale } from '../components/PressableScale';
import { getCreator, getProduct } from '../data';
import { hapticError, hapticSelect } from '../haptics';
import { useStore } from '../store';
import { colors } from '../theme';
import { validateName } from '../validation';
import { homeStyles as styles } from './homeStyles';

type Props = {
  onLogout: () => void;
  onOpenLibrary: () => void;
  onOpenProduct: (id: string) => void;
  onOpenCreator: (id: string) => void;
};

export function ProfileScreen({ onLogout, onOpenLibrary, onOpenProduct, onOpenCreator }: Props) {
  const {
    user,
    owned,
    following,
    memberships,
    orders,
    notifs,
    setNotifs,
    updateName,
    showToast,
    unsubscribe,
  } = useStore();
  const [name, setName] = useState(user?.name ?? '');
  const [nameError, setNameError] = useState<string | null>(null);

  const saveName = () => {
    const error = validateName(name);
    if (error) {
      setNameError(error);
      hapticError();
      return;
    }
    const next = name.trim();
    setNameError(null);
    if (next === user?.name) return;
    updateName(next);
    hapticSelect();
    showToast('Profil mis à jour');
  };

  const confirmLogout = () => {
    Alert.alert('Se déconnecter', 'Tes achats restent liés à ce compte sur l’appareil.', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Se déconnecter', style: 'destructive', onPress: onLogout },
    ]);
  };

  return (
    <ScrollView style={styles.body} contentContainerStyle={styles.tabSceneContent}>
      <FadeSlideIn>
        <Text style={styles.title}>Profil</Text>
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.profileAvatar}>
              <Text style={[styles.brand, { color: '#fff', fontSize: 22 }]}>
                {(user?.name ?? 'R').slice(0, 1).toUpperCase()}
              </Text>
            </View>
            <View style={styles.profileIdentity}>
              <TextInput
                value={name}
                onChangeText={(value) => {
                  setName(value);
                  if (nameError) setNameError(null);
                }}
                onBlur={saveName}
                onSubmitEditing={saveName}
                style={styles.nameInput}
                placeholder="Ton nom"
                placeholderTextColor={colors.placeholder}
              />
              {nameError ? <Text style={styles.fieldError}>{nameError}</Text> : null}
              <Text style={styles.followMeta}>{user?.email ?? 'membre@roux.club'}</Text>
            </View>
          </View>
        </View>
        <View style={styles.stats}>
          <PressableScale style={styles.statCol} contentStyle={styles.stat} onPress={onOpenLibrary}>
            <Text style={styles.statValue}>{Object.keys(memberships).length}</Text>
            <Text style={styles.statLabel}>abos</Text>
          </PressableScale>
          <PressableScale style={styles.statCol} contentStyle={styles.stat} onPress={onOpenLibrary}>
            <Text style={styles.statValue}>{following.length}</Text>
            <Text style={styles.statLabel}>suivis</Text>
          </PressableScale>
          <PressableScale style={styles.statCol} contentStyle={styles.stat} onPress={onOpenLibrary}>
            <Text style={styles.statValue}>{owned.length}</Text>
            <Text style={styles.statLabel}>achats</Text>
          </PressableScale>
        </View>

        <Text style={styles.groupHeader}>Notifications</Text>
        <Group inset={16}>
          <View style={styles.settingRow}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={styles.followName}>Drops Club</Text>
              <Text style={styles.followMeta}>Ateliers dont tu es membre</Text>
            </View>
            <Switch
              value={notifs}
              onValueChange={(value) => {
                setNotifs(value);
                hapticSelect();
                showToast(value ? 'Drops activés' : 'Drops coupés');
              }}
              trackColor={{ false: '#E5E5EA', true: colors.systemGreen }}
              ios_backgroundColor="#E5E5EA"
              thumbColor={colors.white}
            />
          </View>
        </Group>

        <Text style={styles.groupHeader}>Abonnements</Text>
        {Object.keys(memberships).length === 0 ? (
          <Text style={styles.empty}>Aucun palier. Ouvre un atelier et appuie sur S’abonner.</Text>
        ) : (
          <Group inset={16}>
            {Object.entries(memberships).map(([creatorId, price]) => {
              const creator = getCreator(creatorId);
              if (!creator) return null;
              const tier = creator.tiers.find((item) => item.price === price);
              return (
                <View key={creatorId} style={styles.orderRow}>
                  <PressableScale onPress={() => onOpenCreator(creatorId)} style={{ flex: 1 }}>
                    <Text style={styles.followName}>{creator.name}</Text>
                    <Text style={styles.followMeta}>
                      {tier?.name ?? 'Palier'} · {price} €/mois
                    </Text>
                  </PressableScale>
                  <PressableScale
                    onPress={() => {
                      Alert.alert('Résilier', `Arrêter ${creator.name} ?`, [
                        { text: 'Non', style: 'cancel' },
                        {
                          text: 'Résilier',
                          style: 'destructive',
                          onPress: () => {
                            unsubscribe(creatorId);
                            showToast('Abonnement résilié');
                          },
                        },
                      ]);
                    }}
                  >
                    <Text style={{ color: colors.destructive, fontSize: 15 }}>Résilier</Text>
                  </PressableScale>
                </View>
              );
            })}
          </Group>
        )}

        <Text style={styles.groupHeader}>Commandes</Text>
        {orders.length === 0 ? (
          <Text style={styles.empty}>Aucun achat pour le moment.</Text>
        ) : (
          <Group inset={16}>
            {orders.slice(0, 8).map((order) => {
              const date = new Date(order.at);
              const product = order.productId ? getProduct(order.productId) : null;
              const creator = order.creatorId ? getCreator(order.creatorId) : null;
              const title =
                order.kind === 'membership'
                  ? `Abo ${creator?.name ?? 'atelier'}`
                  : (product?.name ?? 'Produit');
              return (
                <PressableScale
                  key={order.id}
                  contentStyle={styles.orderRow}
                  onPress={() => {
                    if (order.kind === 'membership' && order.creatorId) onOpenCreator(order.creatorId);
                    else if (product) onOpenProduct(product.id);
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.followName}>{title}</Text>
                    <Text style={styles.followMeta}>
                      {date.toLocaleDateString('fr-FR')} · {order.price} € · {order.brand} ••{order.last4}
                    </Text>
                  </View>
                  <Text style={styles.chevronSmall}>›</Text>
                </PressableScale>
              );
            })}
          </Group>
        )}

        <Group>
          <PressableScale contentStyle={styles.orderRow} onPress={confirmLogout}>
            <Text style={styles.destructiveText}>Se déconnecter</Text>
          </PressableScale>
        </Group>
      </FadeSlideIn>
    </ScrollView>
  );
}
