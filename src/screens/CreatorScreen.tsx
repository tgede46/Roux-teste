import { ScrollView, Text, View } from 'react-native';
import { Avatar } from '../components/Avatar';
import { FadeSlideIn } from '../components/FadeSlideIn';
import { PressableScale } from '../components/PressableScale';
import { ProductCard } from '../components/ProductCard';
import { getCreator, productsByCreator } from '../data';
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
  const { isFollowing, toggleFollow, showToast } = useStore();
  const products = productsByCreator(creatorId);

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

  return (
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
        <PressableScale
          contentStyle={following ? styles.ghostBtn : styles.primaryBtn}
          onPress={() => {
            toggleFollow(creator.id);
            if (following) hapticSelect();
            else hapticSuccess();
            showToast(following ? `Tu ne suis plus ${creator.name}` : `Tu suis ${creator.name}`);
          }}
        >
          <Text style={following ? styles.ghostBtnText : styles.primaryBtnText}>
            {following ? 'Ne plus suivre' : 'Suivre'}
          </Text>
        </PressableScale>
        <Text style={[styles.sectionTitle, { marginTop: 28 }]}>
          Boutique · {products.length}
        </Text>
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
  );
}
