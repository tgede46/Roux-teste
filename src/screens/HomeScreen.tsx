import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { FadeSlideIn } from '../components/FadeSlideIn';
import { CATEGORIES, CREATORS, PRODUCTS, type CategoryId } from '../data';
import { useStore } from '../store';
import { colors } from '../theme';
import { homeStyles as styles } from './homeStyles';

type Props = {
  onOpenProduct: (id: string) => void;
  onOpenCreator: (id: string) => void;
  onOpenFavorites: () => void;
};

export function HomeScreen({ onOpenProduct, onOpenCreator, onOpenFavorites }: Props) {
  const { following, favorites } = useStore();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryId | null>(null);

  const followed = CREATORS.filter((creator) => following.includes(creator.id));

  const products = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return PRODUCTS.filter((product) => {
      const matchesCategory = category ? product.category === category : true;
      const matchesQuery =
        needle.length === 0 ||
        product.name.toLowerCase().includes(needle) ||
        product.category.toLowerCase().includes(needle);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <ScrollView
      style={styles.body}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <FadeSlideIn delay={40} fromX={-12} fromY={0}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.chevron}>‹</Text>
            <Text style={styles.brand}>Roux</Text>
          </View>
          <Pressable style={styles.heartWrap} onPress={onOpenFavorites}>
            <Ionicons name="heart" size={22} color={colors.heart} />
            {favorites.length > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{favorites.length}</Text>
              </View>
            ) : (
              <Text style={styles.brand}>Roux</Text>
            )}
          </Pressable>
        </View>
      </FadeSlideIn>

      <FadeSlideIn delay={100}>
        <Text style={styles.title}>Accueil</Text>
      </FadeSlideIn>

      <FadeSlideIn delay={160}>
        <View style={styles.search}>
          <Ionicons name="search" size={16} color={colors.placeholder} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Rechercher créateur, produit..."
            placeholderTextColor={colors.placeholder}
            style={styles.searchInput}
          />
        </View>
      </FadeSlideIn>

      <FadeSlideIn delay={220}>
        <Text style={styles.sectionTitle}>Catégories</Text>
        <View style={styles.categories}>
          {CATEGORIES.map((item) => {
            const selected = category === item.id;
            return (
              <Pressable
                key={item.id}
                onPress={() => setCategory(selected ? null : item.id)}
                style={[
                  styles.category,
                  { backgroundColor: item.color },
                  selected && styles.categorySelected,
                ]}
              >
                <Ionicons name={item.icon} size={22} color={colors.white} />
                <Text style={styles.categoryLabel}>{item.id}</Text>
              </Pressable>
            );
          })}
        </View>
      </FadeSlideIn>

      <FadeSlideIn delay={280}>
        <Text style={styles.sectionTitle}>Suivis</Text>
        {followed.map((follow) => (
          <Pressable
            key={follow.id}
            style={styles.followRow}
            onPress={() => onOpenCreator(follow.id)}
          >
            <View style={[styles.avatar, { backgroundColor: follow.color }]} />
            <View>
              <Text style={styles.followName}>{follow.name}</Text>
              <Text style={styles.followMeta}>{follow.meta}</Text>
            </View>
          </Pressable>
        ))}
      </FadeSlideIn>

      <FadeSlideIn delay={340}>
        <Text style={styles.sectionTitle}>Populaires</Text>
        {products.length === 0 ? (
          <Text style={styles.empty}>Rien pour cette recherche. Change de catégorie ou de mot.</Text>
        ) : (
          <View style={[styles.products, styles.wrap]}>
            {products.map((product) => (
              <Pressable
                key={product.id}
                style={[styles.product, { minWidth: '47%', flexGrow: 1 }]}
                onPress={() => onOpenProduct(product.id)}
              >
                <View style={[styles.productArt, { backgroundColor: product.art }]} />
                <View style={[styles.productInfo, { backgroundColor: product.infoBg }]}>
                  <Text
                    style={[styles.productName, product.lightText && { color: colors.white }]}
                  >
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
        )}
      </FadeSlideIn>
    </ScrollView>
  );
}
