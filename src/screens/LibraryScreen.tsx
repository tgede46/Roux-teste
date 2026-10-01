import { Pressable, ScrollView, Text, View } from 'react-native';
import { FadeSlideIn } from '../components/FadeSlideIn';
import { getProduct, PRODUCTS } from '../data';
import { useStore } from '../store';
import { colors } from '../theme';
import { homeStyles as styles } from './homeStyles';

type Props = {
  onOpenProduct: (id: string) => void;
};

export function LibraryScreen({ onOpenProduct }: Props) {
  const { favorites, owned } = useStore();
  const liked = PRODUCTS.filter((product) => favorites.includes(product.id));
  const bought = PRODUCTS.filter((product) => owned.includes(product.id));

  return (
    <ScrollView style={styles.body} contentContainerStyle={styles.content}>
      <FadeSlideIn>
        <Text style={styles.title}>Library</Text>
        <Text style={styles.sectionTitle}>Achats</Text>
        {bought.length === 0 ? (
          <Text style={styles.empty}>Rien encore. Ouvre un produit et appuie sur Acheter.</Text>
        ) : (
          <View style={styles.products}>
            {bought.map((product) => (
              <ProductTile key={product.id} id={product.id} onPress={onOpenProduct} />
            ))}
          </View>
        )}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Favoris</Text>
        {liked.length === 0 ? (
          <Text style={styles.empty}>Le cœur jaune sur l’accueil mène ici.</Text>
        ) : (
          <View style={styles.products}>
            {liked.map((product) => (
              <ProductTile key={product.id} id={product.id} onPress={onOpenProduct} />
            ))}
          </View>
        )}
      </FadeSlideIn>
    </ScrollView>
  );
}

function ProductTile({ id, onPress }: { id: string; onPress: (id: string) => void }) {
  const product = getProduct(id);
  if (!product) return null;
  return (
    <Pressable style={styles.product} onPress={() => onPress(product.id)}>
      <View style={[styles.productArt, { backgroundColor: product.art }]} />
      <View style={[styles.productInfo, { backgroundColor: product.infoBg }]}>
        <Text style={[styles.productName, product.lightText && { color: colors.white }]}>
          {product.name}
        </Text>
        <Text
          style={[styles.productPrice, { color: product.lightText ? colors.white : colors.text }]}
        >
          {product.price} €
        </Text>
      </View>
    </Pressable>
  );
}
