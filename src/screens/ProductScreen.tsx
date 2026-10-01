import { Pressable, ScrollView, Text, View } from 'react-native';
import { FadeSlideIn } from '../components/FadeSlideIn';
import { getCreator, getProduct } from '../data';
import { useStore } from '../store';
import { colors } from '../theme';
import { homeStyles as styles } from './homeStyles';

type Props = {
  productId: string;
  onBack: () => void;
  onOpenCreator: (id: string) => void;
};

export function ProductScreen({ productId, onBack, onOpenCreator }: Props) {
  const product = getProduct(productId);
  const { buy, isOwned, toggleFavorite, isFavorite } = useStore();

  if (!product) {
    return null;
  }

  const creator = getCreator(product.creatorId);
  const owned = isOwned(product.id);
  const liked = isFavorite(product.id);

  return (
    <ScrollView style={styles.body} contentContainerStyle={styles.content}>
      <Pressable style={styles.headerLeft} onPress={onBack}>
        <Text style={styles.chevron}>‹</Text>
        <Text style={styles.brand}>Retour</Text>
      </Pressable>
      <FadeSlideIn>
        <Text style={styles.title}>{product.name}</Text>
        <View style={[styles.detailArt, { backgroundColor: product.art }]} />
        <Text style={styles.detailPrice}>{product.price} €</Text>
        <Text style={styles.detailBlurb}>{product.blurb}</Text>
        {creator ? (
          <Pressable style={styles.followRow} onPress={() => onOpenCreator(creator.id)}>
            <View style={[styles.avatar, { backgroundColor: creator.color }]} />
            <View>
              <Text style={styles.followName}>{creator.name}</Text>
              <Text style={styles.followMeta}>{creator.meta}</Text>
            </View>
          </Pressable>
        ) : null}
        <Pressable style={styles.primaryBtn} onPress={() => buy(product.id)}>
          <Text style={styles.primaryBtnText}>{owned ? 'Dans ta Library' : 'Acheter'}</Text>
        </Pressable>
        <Pressable style={styles.ghostBtn} onPress={() => toggleFavorite(product.id)}>
          <Text style={styles.ghostBtnText}>
            {liked ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          </Text>
        </Pressable>
      </FadeSlideIn>
    </ScrollView>
  );
}
