import { useState } from 'react';
import { ActivityIndicator, Image, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { Avatar } from '../components/Avatar';
import { FadeSlideIn } from '../components/FadeSlideIn';
import { PressableScale } from '../components/PressableScale';
import { ProductCard } from '../components/ProductCard';
import { getCreator, getProduct, relatedProducts } from '../data';
import { hapticLight, hapticSuccess } from '../haptics';
import { useStore } from '../store';
import { colors } from '../theme';
import { homeStyles as styles } from './homeStyles';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  productId: string;
  onBack: () => void;
  onOpenCreator: (id: string) => void;
  onOpenProduct: (id: string) => void;
  onOpenLibrary: () => void;
};

export function ProductScreen({
  productId,
  onBack,
  onOpenCreator,
  onOpenProduct,
  onOpenLibrary,
}: Props) {
  const product = getProduct(productId);
  const { buy, isOwned, toggleFavorite, isFavorite, showToast, hasProductAccess } = useStore();
  const [sheet, setSheet] = useState(false);
  const [paying, setPaying] = useState(false);

  if (!product) {
    return (
      <View style={styles.content}>
        <Text style={styles.empty}>Ce produit n’existe plus.</Text>
        <PressableScale onPress={onBack} contentStyle={styles.ghostBtn}>
          <Text style={styles.ghostBtnText}>Retour</Text>
        </PressableScale>
      </View>
    );
  }

  const creator = getCreator(product.creatorId);
  const owned = isOwned(product.id);
  const included = !owned && hasProductAccess(product.id);
  const liked = isFavorite(product.id);
  const related = relatedProducts(product);

  const pay = () => {
    if (paying) return;
    setPaying(true);
    setTimeout(() => {
      buy(product.id);
      hapticSuccess();
      showToast(`${product.name} est dans ta Library`);
      setPaying(false);
      setSheet(false);
    }, 900);
  };

  return (
    <>
      <ScrollView style={styles.body} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <PressableScale style={styles.headerLeft} onPress={onBack}>
            <Text style={styles.chevron}>‹</Text>
            <Text style={styles.brand}>Retour</Text>
          </PressableScale>
          <PressableScale
            style={styles.heartBtn}
            onPress={() => {
              hapticLight();
              toggleFavorite(product.id);
              showToast(liked ? 'Retiré des favoris' : 'Ajouté aux favoris');
            }}
            accessibilityLabel={liked ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <Ionicons name={liked ? 'heart' : 'heart-outline'} size={22} color={colors.heart} />
          </PressableScale>
        </View>
        <FadeSlideIn>
          <Text style={styles.title}>{product.name}</Text>
          <Image source={product.image} style={styles.detailArt} resizeMode="cover" />
          <Text style={styles.detailPrice}>{product.price} €</Text>
          <Text style={styles.detailBlurb}>{product.blurb}</Text>
          <Text style={[styles.detailBlurb, { marginTop: -12 }]}>{product.details}</Text>
          {creator ? (
            <PressableScale contentStyle={styles.followRow} onPress={() => onOpenCreator(creator.id)}>
              <Avatar photo={creator.photo} color={creator.color} />
              <View>
                <Text style={styles.followName}>{creator.name}</Text>
                <Text style={styles.followMeta}>{creator.meta}</Text>
              </View>
            </PressableScale>
          ) : null}
          <PressableScale
            contentStyle={styles.primaryBtn}
            onPress={() => {
              if (owned || included) {
                onOpenLibrary();
                return;
              }
              setSheet(true);
            }}
          >
            <Text style={styles.primaryBtnText}>
              {owned ? 'Voir dans Library' : included ? 'Inclus dans ton abo' : 'Acheter'}
            </Text>
          </PressableScale>
          {!owned && !included && product.includedAt != null && creator ? (
            <PressableScale
              contentStyle={[styles.ghostBtn, { marginTop: 10 }]}
              onPress={() => onOpenCreator(creator.id)}
            >
              <Text style={styles.ghostBtnText}>Ou inclus dès {product.includedAt} €/mois</Text>
            </PressableScale>
          ) : null}
        </FadeSlideIn>
        {related.length > 0 ? (
          <View style={{ marginTop: 28 }}>
            <Text style={styles.sectionTitle}>Aussi dans Roux</Text>
            <View style={styles.productGrid}>
              {related.map((item) => (
                <ProductCard key={item.id} product={item} onPress={() => onOpenProduct(item.id)} />
              ))}
            </View>
          </View>
        ) : null}
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
            <Text style={styles.sectionTitle}>Confirmer l’achat</Text>
            <Text style={styles.detailBlurb}>
              {product.name} · {product.price} €. Paiement simulé, le fichier rejoint ta Library.
            </Text>
            <PressableScale contentStyle={styles.primaryBtn} onPress={pay} disabled={paying}>
              {paying ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryBtnText}>Payer {product.price} €</Text>
              )}
            </PressableScale>
            <PressableScale contentStyle={styles.ghostBtn} onPress={() => setSheet(false)} disabled={paying}>
              <Text style={styles.ghostBtnText}>Annuler</Text>
            </PressableScale>
          </View>
        </View>
      </Modal>
    </>
  );
}
