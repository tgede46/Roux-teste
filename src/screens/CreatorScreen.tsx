import { useState } from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { Avatar } from '../components/Avatar';
import { FadeSlideIn } from '../components/FadeSlideIn';
import { PressableScale } from '../components/PressableScale';
import { ProductCard } from '../components/ProductCard';
import { getCreator, productsByCreator, type Tier } from '../data';
import { hapticSelect, hapticSuccess } from '../haptics';
import { useStore } from '../store';
import { homeStyles as styles } from './homeStyles';

type Props = {
  creatorId: string;
  onBack: () => void;
  onOpenProduct: (id: string) => void;
};

export function CreatorScreen({ creatorId, onBack, onOpenProduct }: Props) {
  const creator = getCreator(creatorId);
  const { isFollowing, toggleFollow, showToast, subscribe, unsubscribe, memberPrice } = useStore();
  const products = productsByCreator(creatorId);
  const [sheet, setSheet] = useState(false);
  const [paying, setPaying] = useState(false);
  const [picked, setPicked] = useState<Tier | null>(null);

  if (!creator) {
    return (
      <View style={styles.content}>
        <Text style={styles.empty}>Créateur introuvable.</Text>
        <PressableScale onPress={onBack} contentStyle={styles.ghostBtn}>
          <Text style={styles.ghostBtnText}>Retour</Text>
        </PressableScale>
      </View>
    );
  }

  const following = isFollowing(creator.id);
  const price = memberPrice(creator.id);
  const member = price != null;

  const pay = () => {
    const tier = picked ?? creator.tiers[1] ?? creator.tiers[0];
    if (!tier || paying) return;
    setPaying(true);
    setTimeout(() => {
      subscribe(creator.id, tier.price);
      hapticSuccess();
      showToast(`Membre ${creator.name} · ${tier.price} €/mois`);
      setPaying(false);
      setSheet(false);
    }, 900);
  };

  const openSubscribe = () => {
    setPicked(creator.tiers.find((tier) => tier.price === price) ?? creator.tiers[1] ?? creator.tiers[0]);
    setSheet(true);
  };

  const confirmCancel = () => {
    Alert.alert('Résilier', `Tu perds l’accès Club et les fichiers inclus de ${creator.name}.`, [
      { text: 'Garder', style: 'cancel' },
      {
        text: 'Résilier',
        style: 'destructive',
        onPress: () => {
          unsubscribe(creator.id);
          showToast('Abonnement résilié');
        },
      },
    ]);
  };

  return (
    <>
      <ScrollView style={styles.body} contentContainerStyle={styles.content}>
        <PressableScale style={styles.headerLeft} onPress={onBack}>
          <Text style={styles.chevron}>‹</Text>
          <Text style={styles.brand}>Retour</Text>
        </PressableScale>
        <FadeSlideIn>
          <Avatar photo={creator.photo} color={creator.color} size="lg" style={{ marginTop: 16 }} />
          <Text style={styles.title}>{creator.name}</Text>
          <Text style={styles.followMeta}>{creator.meta}</Text>
          <Text style={[styles.detailBlurb, { marginTop: 10 }]}>{creator.bio}</Text>
          {member ? (
            <Text style={styles.memberHint}>Membre · {price} €/mois</Text>
          ) : null}

          <PressableScale contentStyle={styles.primaryBtn} onPress={openSubscribe}>
            <Text style={styles.primaryBtnText}>
              {member ? `Changer de palier · ${price} €` : 'S’abonner'}
            </Text>
          </PressableScale>
          <PressableScale
            contentStyle={[styles.ghostBtn, { marginTop: 10 }]}
            onPress={() => {
              toggleFollow(creator.id);
              if (following) hapticSelect();
              else hapticSuccess();
              showToast(following ? `Tu ne suis plus ${creator.name}` : `Tu suis ${creator.name}`);
            }}
          >
            <Text style={styles.ghostBtnText}>{following ? 'Ne plus suivre' : 'Suivre'}</Text>
          </PressableScale>
          {member ? (
            <PressableScale contentStyle={[styles.ghostBtn, { marginTop: 10 }]} onPress={confirmCancel}>
              <Text style={styles.ghostBtnText}>Résilier</Text>
            </PressableScale>
          ) : null}

          <Text style={[styles.sectionTitle, { marginTop: 28 }]}>Boutique · {products.length}</Text>
          <View style={styles.productGrid}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={() => onOpenProduct(product.id)}
              />
            ))}
          </View>
        </FadeSlideIn>
      </ScrollView>

      <Modal visible={sheet} transparent animationType="slide" onRequestClose={() => setSheet(false)}>
        <View style={styles.modalBackdrop}>
          <Pressable
            style={{ flex: 1 }}
            onPress={() => {
              if (!paying) setSheet(false);
            }}
          />
          <View style={styles.sheet}>
            <Text style={styles.sectionTitle}>Choisir un palier</Text>
            {creator.tiers.map((tier) => {
              const active = (picked?.price ?? price) === tier.price;
              return (
                <PressableScale
                  key={tier.id}
                  contentStyle={[styles.tierRow, active && styles.tierRowActive]}
                  onPress={() => setPicked(tier)}
                >
                  <View>
                    <Text style={styles.followName}>
                      {tier.name} · {tier.price} €/mois
                    </Text>
                    <Text style={styles.followMeta}>{tier.perks}</Text>
                  </View>
                </PressableScale>
              );
            })}
            <PressableScale contentStyle={styles.primaryBtn} onPress={pay} disabled={paying}>
              {paying ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryBtnText}>
                  Payer {picked?.price ?? creator.tiers[1]?.price ?? 8} €/mois
                </Text>
              )}
            </PressableScale>
            <PressableScale
              contentStyle={styles.ghostBtn}
              onPress={() => setSheet(false)}
              disabled={paying}
            >
              <Text style={styles.ghostBtnText}>Annuler</Text>
            </PressableScale>
          </View>
        </View>
      </Modal>
    </>
  );
}
