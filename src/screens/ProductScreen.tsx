import { useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { Avatar } from '../components/Avatar';
import { CheckoutSheet } from '../components/CheckoutSheet';
import { FadeSlideIn } from '../components/FadeSlideIn';
import { PressableScale } from '../components/PressableScale';
import { ProductCard } from '../components/ProductCard';
import { fileKindLabel, getCreator, getProduct, getProductFile, relatedProducts } from '../data';
import { hapticLight, hapticSuccess } from '../haptics';
import { goBack, openCreator, openFile, openProduct } from '../nav';
import type { ChargeOk } from '../payment';
import { useStore } from '../store';
import { colors } from '../theme';
import { homeStyles as styles } from './homeStyles';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  productId: string;
};

export function ProductScreen({ productId }: Props) {
  const product = getProduct(productId);
  const { buy, isOwned, toggleFavorite, isFavorite, showToast, accessKind } = useStore();
  const [sheet, setSheet] = useState(false);
  const [paying, setPaying] = useState(false);

  if (!product) {
    return (
      <View style={styles.content}>
        <Text style={styles.empty}>Ce produit n’existe plus.</Text>
        <PressableScale onPress={goBack} contentStyle={styles.ghostBtn}>
          <Text style={styles.ghostBtnText}>Retour</Text>
        </PressableScale>
      </View>
    );
  }

  const creator = getCreator(product.creatorId);
  const owned = isOwned(product.id);
  const access = accessKind(product.id);
  const included = access === 'member';
  const file = getProductFile(product.id);
  const liked = isFavorite(product.id);
  const related = relatedProducts(product);

  const pay = (charge: ChargeOk) => {
    if (paying) return;
    setPaying(true);
    buy(product.id, charge);
    hapticSuccess();
    showToast(`${product.name} est dans ta Library`);
    setPaying(false);
    setSheet(false);
    openFile(product.id);
  };

  return (
    <>
      <ScrollView style={styles.body} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <PressableScale style={styles.headerLeft} onPress={goBack}>
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
          {file ? (
            <Text style={styles.followMeta}>
              {fileKindLabel(file.kind)} · {file.fileName}
            </Text>
          ) : null}
          <Text style={styles.detailBlurb}>{product.blurb}</Text>
          <Text style={[styles.detailBlurb, { marginTop: -12 }]}>{product.details}</Text>
          {file ? (
            <>
              <Text style={styles.sectionTitle}>Tu reçois</Text>
              {file.items.map((item) => (
                <Text key={item} style={styles.followMeta}>
                  · {item}
                </Text>
              ))}
              <Text style={[styles.detailBlurb, { marginTop: 12 }]}>{file.licence}</Text>
            </>
          ) : null}
          {creator ? (
            <PressableScale contentStyle={styles.followRow} onPress={() => openCreator(creator.id)}>
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
                openFile(product.id);
                return;
              }
              setSheet(true);
            }}
          >
            <Text style={styles.primaryBtnText}>
              {owned || included ? 'Ouvrir le fichier' : 'Acheter'}
            </Text>
          </PressableScale>
          {owned ? (
            <Text style={[styles.memberHint, { marginTop: 10 }]}>Déjà acheté — pas de rachat.</Text>
          ) : included ? (
            <Text style={[styles.memberHint, { marginTop: 10 }]}>Inclus dans ton abo — pas de rachat.</Text>
          ) : null}
          {!owned && !included && product.includedAt != null && creator ? (
            <PressableScale
              contentStyle={[styles.ghostBtn, { marginTop: 10 }]}
              onPress={() => openCreator(creator.id)}
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
                <ProductCard key={item.id} product={item} onPress={() => openProduct(item.id)} />
              ))}
            </View>
          </View>
        ) : null}
      </ScrollView>

      <CheckoutSheet
        visible={sheet}
        title="Payer"
        subtitle={`${product.name} · ${product.price} €. Carte sandbox, le fichier rejoint ta Library.`}
        amountLabel={`Payer ${product.price} €`}
        busy={paying}
        onClose={() => setSheet(false)}
        onPaid={pay}
      />
    </>
  );
}
