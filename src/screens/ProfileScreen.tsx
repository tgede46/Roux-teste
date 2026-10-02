import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { FadeSlideIn } from '../components/FadeSlideIn';
import { Group } from '../components/Group';
import { PressableScale } from '../components/PressableScale';
import { getCreator, getProduct } from '../data';
import { hapticError, hapticSelect, hapticSuccess } from '../haptics';
import { openCreator, openLibrary, openProduct, openStudio } from '../nav';
import { useStore } from '../store';
import { colors, fonts, radius, uiFont } from '../theme';
import { validateName } from '../validation';
import { homeStyles } from './homeStyles';

export function ProfileScreen() {
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
    logout,
  } = useStore();

  const [name, setName] = useState(user?.name ?? '');
  const [nameError, setNameError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const saveName = () => {
    const error = validateName(name);
    if (error) {
      setNameError(error);
      hapticError();
      return;
    }
    const next = name.trim();
    setNameError(null);
    setIsEditing(false);
    if (next === user?.name) return;
    updateName(next);
    hapticSuccess();
    showToast('Profil mis à jour');
  };

  const confirmLogout = () => {
    Alert.alert('Se déconnecter', 'Tes achats et abonnements restent liés à ce compte sur cet appareil.', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Se déconnecter',
        style: 'destructive',
        onPress: () => {
          hapticSelect();
          logout();
        },
      },
    ]);
  };

  const memberCount = Object.keys(memberships).length;
  const initial = (user?.name?.trim() || 'R').charAt(0).toUpperCase();

  return (
    <ScrollView
      style={homeStyles.body}
      contentContainerStyle={[homeStyles.tabSceneContent, s.container]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <FadeSlideIn delay={30}>
        <Text style={homeStyles.title}>Profil</Text>
      </FadeSlideIn>

      {/* Carte d'identité Membre */}
      <FadeSlideIn delay={80}>
        <View style={s.idCard}>
          <View style={s.idCardTop}>
            <View style={s.avatarWrap}>
              <View style={s.avatar}>
                <Text style={s.avatarLetter}>{initial}</Text>
              </View>
              <View style={s.verifiedBadge}>
                <Ionicons name="checkmark" size={12} color={colors.white} />
              </View>
            </View>

            <View style={s.identityCol}>
              <View style={s.badgeRow}>
                <View style={s.memberPill}>
                  <View style={s.onlineDot} />
                  <Text style={s.memberPillText}>MEMBRE ROUX</Text>
                </View>
              </View>

              <View style={s.nameRow}>
                <TextInput
                  value={name}
                  onChangeText={(val) => {
                    setName(val);
                    if (nameError) setNameError(null);
                  }}
                  onFocus={() => setIsEditing(true)}
                  onBlur={saveName}
                  onSubmitEditing={saveName}
                  style={s.nameInput}
                  placeholder="Ton nom complet"
                  placeholderTextColor={colors.placeholder}
                  returnKeyType="done"
                  maxLength={40}
                  accessibilityLabel="Nom de profil"
                />
                {isEditing ? (
                  <PressableScale onPress={saveName} hitSlop={8} style={s.checkBtn}>
                    <Ionicons name="checkmark-circle" size={22} color={colors.text} />
                  </PressableScale>
                ) : (
                  <Ionicons name="pencil-outline" size={16} color={colors.muted} />
                )}
              </View>
              {nameError ? <Text style={s.fieldError}>{nameError}</Text> : null}

              <Text style={s.emailText}>{user?.email ?? 'membre@roux.club'}</Text>
            </View>
          </View>
        </View>
      </FadeSlideIn>

      {/* Carte Black Studio Créateur */}
      <FadeSlideIn delay={120}>
        <PressableScale style={s.studioCard} onPress={openStudio} accessibilityRole="button">
          <View style={s.studioContent}>
            <View style={s.studioIconBox}>
              <Ionicons name="sparkles" size={20} color={colors.white} />
            </View>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={s.studioTitle}>Atelier Créateur</Text>
              <Text style={s.studioSubtitle}>
                Publie des drops exclusifs, des posts Club et gère tes paliers.
              </Text>
            </View>
            <View style={s.studioArrow}>
              <Ionicons name="arrow-forward" size={16} color={colors.text} />
            </View>
          </View>
        </PressableScale>
      </FadeSlideIn>

      {/* Triptyque Statistiques */}
      <FadeSlideIn delay={160}>
        <View style={s.statsRow}>
          <PressableScale
            style={s.statCol}
            contentStyle={s.statCard}
            onPress={openLibrary}
            accessibilityRole="button"
            accessibilityLabel={`${memberCount} abonnements`}
          >
            <Ionicons name="people-outline" size={18} color={colors.text} style={s.statIcon} />
            <Text style={s.statNumber}>{memberCount}</Text>
            <Text style={s.statTitle}>ABONNEMENTS</Text>
          </PressableScale>

          <PressableScale
            style={s.statCol}
            contentStyle={s.statCard}
            onPress={openLibrary}
            accessibilityRole="button"
            accessibilityLabel={`${following.length} créateurs suivis`}
          >
            <Ionicons name="heart-outline" size={18} color={colors.text} style={s.statIcon} />
            <Text style={s.statNumber}>{following.length}</Text>
            <Text style={s.statTitle}>SUIVIS</Text>
          </PressableScale>

          <PressableScale
            style={s.statCol}
            contentStyle={s.statCard}
            onPress={openLibrary}
            accessibilityRole="button"
            accessibilityLabel={`${owned.length} achats possédés`}
          >
            <Ionicons name="bag-handle-outline" size={18} color={colors.text} style={s.statIcon} />
            <Text style={s.statNumber}>{owned.length}</Text>
            <Text style={s.statTitle}>ACHATS</Text>
          </PressableScale>
        </View>
      </FadeSlideIn>

      {/* Section Alertes & Préférences */}
      <FadeSlideIn delay={200}>
        <Text style={s.sectionHeader}>PRÉFÉRENCES</Text>
        <Group inset={56}>
          <View style={s.settingRow}>
            <View style={s.settingIconBox}>
              <Ionicons name="notifications-outline" size={20} color={colors.text} />
            </View>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={s.settingTitle}>Drops & Actualités</Text>
              <Text style={s.settingSubtitle}>Être notifié dès qu’un atelier publie</Text>
            </View>
            <Switch
              value={notifs}
              onValueChange={(value) => {
                setNotifs(value);
                hapticSelect();
                showToast(value ? 'Notifications activées' : 'Notifications en pause');
              }}
              trackColor={{ false: colors.fill, true: colors.text }}
              ios_backgroundColor={colors.fill}
              thumbColor={colors.white}
            />
          </View>
        </Group>
      </FadeSlideIn>

      {/* Section Abonnements */}
      <FadeSlideIn delay={240}>
        <Text style={s.sectionHeader}>MES ABONNEMENTS ({memberCount})</Text>
        {memberCount === 0 ? (
          <View style={s.emptyCard}>
            <Ionicons name="card-outline" size={28} color={colors.muted} style={{ marginBottom: 6 }} />
            <Text style={s.emptyTitle}>Aucun palier actif</Text>
            <Text style={s.emptySubtitle}>
              Rejoins les ateliers de tes créateurs favoris pour débloquer leurs drops privés.
            </Text>
          </View>
        ) : (
          <Group inset={56}>
            {Object.entries(memberships).map(([creatorId, price]) => {
              const creator = getCreator(creatorId);
              if (!creator) return null;
              const tier = creator.tiers.find((item) => item.price === price);
              return (
                <View key={creatorId} style={s.membershipRow}>
                  <View style={s.settingIconBox}>
                    <Ionicons name="star-outline" size={20} color={colors.text} />
                  </View>
                  <PressableScale onPress={() => openCreator(creatorId)} style={{ flex: 1 }}>
                    <Text style={s.settingTitle}>{creator.name}</Text>
                    <Text style={s.settingSubtitle}>
                      {tier?.name ?? 'Palier'} · {price} €/mois
                    </Text>
                  </PressableScale>
                  <PressableScale
                    onPress={() => {
                      hapticSelect();
                      Alert.alert('Résilier l’abonnement', `Es-tu sûr de vouloir arrêter ton abonnement à ${creator.name} ?`, [
                        { text: 'Conserver', style: 'cancel' },
                        {
                          text: 'Résilier',
                          style: 'destructive',
                          onPress: () => {
                            unsubscribe(creatorId);
                            hapticSelect();
                            showToast('Abonnement résilié');
                          },
                        },
                      ]);
                    }}
                    style={s.cancelBtn}
                  >
                    <Text style={s.cancelBtnText}>Gérer</Text>
                  </PressableScale>
                </View>
              );
            })}
          </Group>
        )}
      </FadeSlideIn>

      {/* Section Commandes & Reçus */}
      <FadeSlideIn delay={280}>
        <Text style={s.sectionHeader}>HISTORIQUE DES ACHATS</Text>
        {orders.length === 0 ? (
          <View style={s.emptyCard}>
            <Ionicons name="receipt-outline" size={28} color={colors.muted} style={{ marginBottom: 6 }} />
            <Text style={s.emptyTitle}>Aucun achat enregistré</Text>
            <Text style={s.emptySubtitle}>Tes reçus et fichiers achetés apparaîtront ici.</Text>
          </View>
        ) : (
          <Group inset={56}>
            {orders.slice(0, 8).map((order) => {
              const date = new Date(order.at);
              const product = order.productId ? getProduct(order.productId) : null;
              const creator = order.creatorId ? getCreator(order.creatorId) : null;
              const title =
                order.kind === 'membership'
                  ? `Abonnement · ${creator?.name ?? 'Atelier'}`
                  : (product?.name ?? 'Produit numérique');
              return (
                <PressableScale
                  key={order.id}
                  contentStyle={s.orderRow}
                  onPress={() => {
                    hapticSelect();
                    if (order.kind === 'membership' && order.creatorId) openCreator(order.creatorId);
                    else if (product) openProduct(product.id);
                  }}
                  accessibilityRole="button"
                >
                  <View style={s.settingIconBox}>
                    <Ionicons name="receipt-outline" size={18} color={colors.text} />
                  </View>
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <Text style={s.settingTitle} numberOfLines={1}>{title}</Text>
                    <Text style={s.settingSubtitle}>
                      {date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })} · Carte ••{order.last4}
                    </Text>
                  </View>
                  <View style={s.orderRight}>
                    <Text style={s.orderPrice}>{order.price} €</Text>
                    <Ionicons name="chevron-forward" size={16} color={colors.muted} />
                  </View>
                </PressableScale>
              );
            })}
          </Group>
        )}
      </FadeSlideIn>

      {/* Section Compte & Sécurité */}
      <FadeSlideIn delay={320}>
        <Text style={s.sectionHeader}>SÉCURITÉ & SESSION</Text>
        <Group>
          <PressableScale
            contentStyle={s.logoutRow}
            onPress={confirmLogout}
            accessibilityRole="button"
            accessibilityLabel="Se déconnecter"
          >
            <Ionicons name="log-out-outline" size={20} color={colors.text} style={{ marginRight: 12 }} />
            <Text style={s.logoutText}>Se déconnecter du compte</Text>
          </PressableScale>
        </Group>

        <View style={s.appFooter}>
          <Text style={s.footerBrand}>ROUX</Text>
          <Text style={s.footerVersion}>Version 1.0.0 · Édition Monochrome B&W</Text>
        </View>
      </FadeSlideIn>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {
    paddingBottom: 120,
  },
  idCard: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.separator,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  idCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontFamily: fonts.bold,
    fontSize: 26,
    color: colors.white,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.text,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  identityCol: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  memberPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.fill,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 6,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.text,
  },
  memberPillText: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    letterSpacing: 0.6,
    color: colors.text,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nameInput: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.text,
    paddingVertical: 0,
    flex: 1,
  },
  checkBtn: {
    padding: 2,
  },
  emailText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.muted,
    marginTop: 4,
  },
  fieldError: {
    fontFamily: uiFont,
    fontSize: 12,
    color: colors.destructive,
    marginTop: 3,
  },
  studioCard: {
    backgroundColor: colors.text,
    borderRadius: radius.card,
    padding: 16,
    marginBottom: 16,
  },
  studioContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studioIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceInverse,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  studioTitle: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.white,
    marginBottom: 2,
  },
  studioSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.secondary,
    lineHeight: 17,
  },
  studioArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  statCol: {
    flex: 1,
  },
  statCard: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.separator,
  },
  statIcon: {
    marginBottom: 6,
    opacity: 0.85,
  },
  statNumber: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.text,
    lineHeight: 26,
  },
  statTitle: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    letterSpacing: 0.5,
    color: colors.muted,
    marginTop: 4,
  },
  sectionHeader: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    letterSpacing: 0.8,
    color: colors.muted,
    marginBottom: 8,
    marginTop: 4,
    paddingHorizontal: 4,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  settingIconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: colors.fill,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  settingTitle: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    color: colors.text,
  },
  settingSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
    marginTop: 2,
  },
  membershipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  cancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: colors.fill,
  },
  cancelBtnText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.text,
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  orderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  orderPrice: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.text,
  },
  emptyCard: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.separator,
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    color: colors.text,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280,
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  logoutText: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    color: colors.text,
  },
  appFooter: {
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 16,
  },
  footerBrand: {
    fontFamily: fonts.bold,
    fontSize: 13,
    letterSpacing: 2,
    color: colors.placeholder,
    marginBottom: 4,
  },
  footerVersion: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.placeholder,
  },
});
