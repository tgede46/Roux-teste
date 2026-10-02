import { Image, Text, View } from 'react-native';
import { colors } from '../theme';
import { homeStyles as styles } from '../screens/homeStyles';
import { PressableScale } from './PressableScale';
import type { Product } from '../data';

type Props = {
  product: Product;
  onPress: () => void;
};

export function ProductCard({ product, onPress }: Props) {
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${product.name}, ${product.price} euros`}
      style={styles.productTile}
      contentStyle={styles.product}
    >
      <Image source={product.image} style={styles.productArt} resizeMode="cover" />
      <View style={[styles.productInfo, { backgroundColor: product.infoBg }]}>
        <Text
          style={[styles.productName, product.lightText && { color: colors.white }]}
          numberOfLines={2}
        >
          {product.name}
        </Text>
        <Text
          style={[styles.productPrice, { color: product.lightText ? colors.white : colors.text }]}
        >
          {product.price} €
        </Text>
        {product.includedAt != null ? (
          <Text
            style={[
              styles.includeBadge,
              product.lightText && { color: colors.white, opacity: 0.9 },
            ]}
          >
            Inclus dès {product.includedAt} €
          </Text>
        ) : null}
      </View>
    </PressableScale>
  );
}
