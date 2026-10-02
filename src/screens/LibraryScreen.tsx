import { useMemo, useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { EmptyState } from '../components/EmptyState';
import { FadeSlideIn } from '../components/FadeSlideIn';
import { Group } from '../components/Group';
import { PressableScale } from '../components/PressableScale';
import { PRODUCTS, fileKindLabel, getProductFile } from '../data';
import { hapticSelect } from '../haptics';
import { useStore, type AccessKind } from '../store';
import { homeStyles as styles } from './homeStyles';

type Filter = 'purchase' | 'member' | 'fav';

type Props = {
  onOpenProduct: (id: string) => void;
  onOpenFile: (id: string) => void;
  onBrowse: () => void;
};

export function LibraryScreen({ onOpenProduct, onOpenFile, onBrowse }: Props) {
  const { favorites, accessKind, isOpened } = useStore();
  const [filter, setFilter] = useState<Filter>('purchase');

  const purchases = PRODUCTS.filter((product) => accessKind(product.id) === 'purchase');
  const members = PRODUCTS.filter((product) => accessKind(product.id) === 'member');
  const liked = PRODUCTS.filter((product) => favorites.includes(product.id));

  const items = useMemo(() => {
    if (filter === 'purchase') return purchases;
    if (filter === 'member') return members;
    return liked;
  }, [filter, purchases, members, liked]);

  return (
    <ScrollView style={styles.body} contentContainerStyle={styles.tabSceneContent}>
      <FadeSlideIn>
        <Text style={styles.title}>Bibliothèque</Text>
        <View style={styles.chips}>
          {(
            [
              { id: 'purchase', label: `Achats ${purchases.length}` },
              { id: 'member', label: `Membres ${members.length}` },
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
            title={
              filter === 'fav'
                ? 'Aucun favori'
                : filter === 'member'
                  ? 'Rien via un abo'
                  : 'Aucun achat'
            }
            body={
              filter === 'fav'
                ? 'Le cœur sur un produit le range ici.'
                : filter === 'member'
                  ? 'Les fichiers inclus dans tes paliers apparaissent ici, une fois, sans rachat.'
                  : 'Achète un pack — il s’ouvre ici tout de suite.'
            }
            actionLabel="Aller à la boutique"
            onAction={onBrowse}
          />
        ) : (
          <Group inset={80}>
            {items.map((product) => {
              const kind = accessKind(product.id);
              const file = getProductFile(product.id);
              const canOpen = kind != null;
              return (
                <PressableScale
                  key={product.id}
                  contentStyle={styles.libraryRow}
                  onPress={() => (canOpen ? onOpenFile(product.id) : onOpenProduct(product.id))}
                >
                  <Image source={product.image} style={styles.libraryThumb} resizeMode="cover" />
                  <View style={styles.libraryMeta}>
                    <Text style={styles.followName} numberOfLines={1}>
                      {product.name}
                    </Text>
                    <Text style={styles.followMeta}>
                      {file ? fileKindLabel(file.kind) : product.category}
                      {kind ? ` · ${sourceLabel(kind)}` : ''}
                      {canOpen && isOpened(product.id) ? ' · Ouvert' : canOpen ? ' · Nouveau' : ''}
                    </Text>
                  </View>
                  <Text style={styles.chevronSmall}>›</Text>
                </PressableScale>
              );
            })}
          </Group>
        )}
      </FadeSlideIn>
    </ScrollView>
  );
}

function sourceLabel(kind: AccessKind) {
  if (kind === 'purchase') return 'Achat';
  if (kind === 'member') return 'Membre';
  return '';
}
