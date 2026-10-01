import { Pressable, ScrollView, Text, View } from 'react-native';
import { FadeSlideIn } from '../components/FadeSlideIn';
import { getCreator, productsByCreator } from '../data';
import { useStore } from '../store';
import { colors } from '../theme';
import { homeStyles as styles } from './homeStyles';

type Props = {
  creatorId: string;
  onBack: () => void;
  onOpenProduct: (id: string) => void;
};

export function CreatorScreen({ creatorId, onBack, onOpenProduct }: Props) {
  const creator = getCreator(creatorId);
  const { isFollowing, toggleFollow } = useStore();
  const products = productsByCreator(creatorId);

  if (!creator) {
    return null;
  }

  const following = isFollowing(creator.id);

  return (
    <ScrollView style={styles.body} contentContainerStyle={styles.content}>
      <Pressable style={styles.headerLeft} onPress={onBack}>
        <Text style={styles.chevron}>‹</Text>
        <Text style={styles.brand}>Retour</Text>
      </Pressable>
      <FadeSlideIn>
        <View style={[styles.profileAvatar, { backgroundColor: creator.color, marginTop: 16 }]} />
        <Text style={styles.title}>{creator.name}</Text>
        <Text style={styles.detailBlurb}>{creator.bio}</Text>
        <Pressable style={following ? styles.ghostBtn : styles.primaryBtn} onPress={() => toggleFollow(creator.id)}>
          <Text style={following ? styles.ghostBtnText : styles.primaryBtnText}>
            {following ? 'Ne plus suivre' : 'Suivre'}
          </Text>
        </Pressable>
        <Text style={[styles.sectionTitle, { marginTop: 28 }]}>Boutique</Text>
        <View style={styles.products}>
          {products.map((product) => (
            <Pressable key={product.id} style={styles.product} onPress={() => onOpenProduct(product.id)}>
              <View style={[styles.productArt, { backgroundColor: product.art }]} />
              <View style={[styles.productInfo, { backgroundColor: product.infoBg }]}>
                <Text style={[styles.productName, product.lightText && { color: colors.white }]}>
                  {product.name}
                </Text>
                <Text
                  style={[
                    styles.productPrice,
                    { color: product.lightText ? colors.white : colors.text },
                  ]}
                >
                  {product.price} €
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </FadeSlideIn>
    </ScrollView>
  );
}
