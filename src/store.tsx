import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

type Store = {
  favorites: string[];
  owned: string[];
  following: string[];
  toggleFavorite: (id: string) => void;
  buy: (id: string) => void;
  toggleFollow: (id: string) => void;
  isFavorite: (id: string) => boolean;
  isOwned: (id: string) => boolean;
  isFollowing: (id: string) => boolean;
};

const StoreContext = createContext<Store | null>(null);

function toggleId(list: string[], id: string) {
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(['affiche-jungle']);
  const [owned, setOwned] = useState<string[]>([]);
  const [following, setFollowing] = useState<string[]>(['mina', 'roux', 'leo']);

  const value = useMemo<Store>(
    () => ({
      favorites,
      owned,
      following,
      toggleFavorite: (id) => setFavorites((list) => toggleId(list, id)),
      buy: (id) => setOwned((list) => (list.includes(id) ? list : [...list, id])),
      toggleFollow: (id) => setFollowing((list) => toggleId(list, id)),
      isFavorite: (id) => favorites.includes(id),
      isOwned: (id) => owned.includes(id),
      isFollowing: (id) => following.includes(id),
    }),
    [favorites, owned, following],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used inside StoreProvider');
  }
  return store;
}
