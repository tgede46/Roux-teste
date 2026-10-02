import { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { EmptyState } from '../components/EmptyState';
import { FadeSlideIn } from '../components/FadeSlideIn';
import { PressableScale } from '../components/PressableScale';
import { ProductCard } from '../components/ProductCard';
import { PRODUCTS } from '../data';
import { hapticSelect } from '../haptics';
import { useStore } from '../store';
import { homeStyles as styles } from './homeStyles';

type Filter = 'all' | 'owned' | 'fav';

type Props = {
  onOpenProduct: (id: string) => void;
  onBrowse: () => void;
};

export function LibraryScreen({ onOpenProduct, onBrowse }: Props) {
  const { favorites, owned, hasProductAccess } = useStore();
  const [filter, setFilter] = useState<Filter>('all');

  const liked = PRODUCTS.filter((product) => favorites.includes(product.id));
  const bought = PRODUCTS.filter((product) => hasProductAccess(product.id));
  const items = useMemo(() => {
    if (filter === 'owned') return bought;
    if (filter === 'fav') return liked;
    const ids = new Set([...owned, ...favorites, ...bought.map((product) => product.id)]);
    return PRODUCTS.filter((product) => ids.has(product.id));
  }, [filter, liked, bought, owned, favorites]);

  return (
    <ScrollView style={styles.body} contentContainerStyle={styles.content}>
      <FadeSlideIn>
        <Text style={styles.title}>Library</Text>
        <View style={styles.chips}>
          {(
            [
              { id: 'all', label: 'Tout' },
              { id: 'owned', label: `Possédés ${bought.length}` },
              { id: 'fav', label: `Favoris ${liked.length}` },
            ] as const
          ).map((chip) => {
            const active = filter === chip.id;
            return (
              <PressableScale
                key={chip.id}
                onPress={() => {
                  hapticSelect();
                  setFilter(chip.id);
                }}
                contentStyle={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{chip.label}</Text>
              </PressableScale>
            );
          })}
        </View>
        {items.length === 0 ? (
          <EmptyState
            title={filter === 'fav' ? 'Aucun favori' : 'Library vide'}
            body={
              filter === 'fav'
                ? 'Le cœur sur un produit le range ici.'
                : 'Achète un pack, une affiche ou un loop — il apparaît ici tout de suite.'
            }
            actionLabel="Aller à la boutique"
            onAction={onBrowse}
          />
        ) : (
          <View style={styles.productGrid}>
            {items.map((product) => (
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
