import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Image, ScrollView, Text, TextInput, View } from 'react-native';
import { Avatar } from '../components/Avatar';
import { EmptyState } from '../components/EmptyState';
import { FadeSlideIn } from '../components/FadeSlideIn';
import { PressableScale } from '../components/PressableScale';
import { ProductCard } from '../components/ProductCard';
import { CATEGORIES, CREATORS, PRODUCTS, firstName, type CategoryId } from '../data';
import { hapticSelect } from '../haptics';
import { useStore } from '../store';
import { colors } from '../theme';
import { homeStyles as styles } from './homeStyles';

type Props = {
  onOpenProduct: (id: string) => void;
  onOpenCreator: (id: string) => void;
  onOpenFavorites: () => void;
};

export function HomeScreen({ onOpenProduct, onOpenCreator, onOpenFavorites }: Props) {
  const { following, favorites, user } = useStore();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryId | null>(null);

  const followed = CREATORS.filter((creator) => following.includes(creator.id));
  const needle = query.trim().toLowerCase();

  const products = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory = category ? product.category === category : true;
      const matchesQuery =
        needle.length === 0 ||
        product.name.toLowerCase().includes(needle) ||
        product.category.toLowerCase().includes(needle) ||
        product.blurb.toLowerCase().includes(needle);
      return matchesCategory && matchesQuery;
    });
  }, [category, needle]);

  const creators = useMemo(() => {
    if (!needle) return [];
    return CREATORS.filter(
      (creator) =>
        creator.name.toLowerCase().includes(needle) || creator.meta.toLowerCase().includes(needle),
    );
  }, [needle]);

  return (
    <ScrollView
      style={styles.body}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <FadeSlideIn delay={40} fromX={-12} fromY={0}>
        <View style={styles.header}>
          <Text style={styles.brand}>Roux</Text>
          <PressableScale
            style={styles.heartWrap}
            onPress={() => {
              hapticSelect();
              onOpenFavorites();
            }}
            accessibilityLabel="Ouvrir les favoris"
          >
            <Ionicons name="heart" size={22} color={colors.heart} />
            {favorites.length > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{favorites.length}</Text>
              </View>
            ) : null}
          </PressableScale>
        </View>
      </FadeSlideIn>

      <FadeSlideIn delay={90}>
        <Text style={styles.greeting}>Salut {firstName(user?.name ?? 'toi')}</Text>
        <Text style={styles.title}>Accueil</Text>
      </FadeSlideIn>

      <FadeSlideIn delay={140}>
        <View style={styles.search}>
          <Ionicons name="search" size={16} color={colors.placeholder} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Rechercher créateur, produit..."
            placeholderTextColor={colors.placeholder}
            style={styles.searchInput}
            returnKeyType="search"
          />
          {query.length > 0 ? (
            <PressableScale onPress={() => setQuery('')} hitSlop={8} accessibilityLabel="Effacer">
              <Ionicons name="close-circle" size={18} color={colors.placeholder} />
            </PressableScale>
          ) : null}
        </View>
      </FadeSlideIn>

      <FadeSlideIn delay={180}>
        <Text style={styles.sectionTitle}>Catégories</Text>
        <View style={styles.categories}>
          {CATEGORIES.map((item) => {
            const selected = category === item.id;
            return (
              <PressableScale
                key={item.id}
                style={styles.categoryCol}
                onPress={() => {
                  hapticSelect();
                  setCategory(selected ? null : item.id);
                }}
              >
                <View style={[styles.category, selected && styles.categorySelected]}>
                  <Image source={item.image} style={styles.categoryImage} resizeMode="cover" />
                  <View style={styles.categoryScrim} />
                  <Ionicons name={item.icon} size={22} color={colors.white} />
                </View>
                <Text style={styles.categoryLabel} numberOfLines={1}>
                  {item.id}
                </Text>
              </PressableScale>
            );
          })}
        </View>
      </FadeSlideIn>

      {creators.length > 0 ? (
        <FadeSlideIn delay={200}>
          <Text style={styles.sectionTitle}>Créateurs</Text>
          {creators.map((creator) => (
            <PressableScale
              key={creator.id}
              contentStyle={styles.followRow}
              onPress={() => onOpenCreator(creator.id)}
            >
              <Avatar photo={creator.photo} color={creator.color} />
              <View>
                <Text style={styles.followName}>{creator.name}</Text>
                <Text style={styles.followMeta}>{creator.meta}</Text>
              </View>
            </PressableScale>
          ))}
        </FadeSlideIn>
      ) : null}

      <FadeSlideIn delay={220}>
        <Text style={styles.sectionTitle}>Suivis</Text>
        {followed.length === 0 ? (
          <EmptyState
            title="Personne pour l’instant"
            body="Ouvre un atelier et appuie sur Suivre. Le Club te montrera leurs posts."
          />
        ) : (
          followed.map((follow) => (
            <PressableScale
              key={follow.id}
              contentStyle={styles.followRow}
              onPress={() => onOpenCreator(follow.id)}
            >
              <Avatar photo={follow.photo} color={follow.color} />
              <View>
                <Text style={styles.followName}>{follow.name}</Text>
                <Text style={styles.followMeta}>{follow.meta}</Text>
              </View>
            </PressableScale>
          ))
        )}
      </FadeSlideIn>

      <FadeSlideIn delay={260}>
        <Text style={styles.sectionTitle}>Boutique</Text>
        {products.length === 0 ? (
          <EmptyState
            title="Rien pour cette recherche"
            body="Change de catégorie ou de mot. Essaie jungle, loop, riso…"
            actionLabel="Tout voir"
            onAction={() => {
              setQuery('');
              setCategory(null);
            }}
          />
        ) : (
          <View style={styles.productGrid}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={() => onOpenProduct(product.id)}
              />
            ))}
          </View>
        )}
      </FadeSlideIn>
    </ScrollView>
  );
}
