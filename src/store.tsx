import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { CLUB_POSTS, getProduct, ME_CREATOR_ID, type ClubPost } from './data';

const STORAGE_KEY = 'roux-store-v1';

export type User = {
  name: string;
  email: string;
};

export type Order = {
  id: string;
  productId: string;
  price: number;
  at: number;
};

type Toast = {
  message: string;
};

type Store = {
  ready: boolean;
  user: User | null;
  favorites: string[];
  owned: string[];
  following: string[];
  orders: Order[];
  likedPosts: string[];
  posts: ClubPost[];
  notifs: boolean;
  toast: Toast | null;
  login: (user: User) => void;
  logout: () => void;
  updateName: (name: string) => void;
  toggleFavorite: (id: string) => void;
  buy: (id: string) => boolean;
  toggleFollow: (id: string) => void;
  togglePostLike: (id: string) => void;
  addPost: (text: string) => void;
  setNotifs: (value: boolean) => void;
  isFavorite: (id: string) => boolean;
  isOwned: (id: string) => boolean;
  isFollowing: (id: string) => boolean;
  isPostLiked: (id: string) => boolean;
  showToast: (message: string) => void;
  clearToast: () => void;
};

type Persisted = {
  user: User | null;
  favorites: string[];
  owned: string[];
  following: string[];
  orders: Order[];
  likedPosts: string[];
  extraPosts: ClubPost[];
  notifs: boolean;
};

const StoreContext = createContext<Store | null>(null);

function toggleId(list: string[], id: string) {
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
}

const defaults: Persisted = {
  user: null,
  favorites: ['affiche-jungle'],
  owned: [],
  following: ['mina', 'roux', 'leo'],
  orders: [],
  likedPosts: [],
  extraPosts: [],
  notifs: true,
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<string[]>(defaults.favorites);
  const [owned, setOwned] = useState<string[]>([]);
  const [following, setFollowing] = useState<string[]>(defaults.following);
  const [orders, setOrders] = useState<Order[]>([]);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [extraPosts, setExtraPosts] = useState<ClubPost[]>([]);
  const [notifs, setNotifs] = useState(true);
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (cancelled || !raw) return;
        const parsed = JSON.parse(raw) as Partial<Persisted>;
        if (parsed.user) setUser(parsed.user);
        if (parsed.favorites) setFavorites(parsed.favorites);
        if (parsed.owned) setOwned(parsed.owned);
        if (parsed.following) setFollowing(parsed.following);
        if (parsed.orders) setOrders(parsed.orders);
        if (parsed.likedPosts) setLikedPosts(parsed.likedPosts);
        if (parsed.extraPosts) setExtraPosts(parsed.extraPosts);
        if (typeof parsed.notifs === 'boolean') setNotifs(parsed.notifs);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const payload: Persisted = {
      user,
      favorites,
      owned,
      following,
      orders,
      likedPosts,
      extraPosts,
      notifs,
    };
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload)).catch(() => undefined);
  }, [ready, user, favorites, owned, following, orders, likedPosts, extraPosts, notifs]);

  const showToast = useCallback((message: string) => {
    setToast({ message });
  }, []);

  const login = useCallback((next: User) => {
    setUser(next);
    showToast(`Salut ${next.name.split(' ')[0]}`);
  }, [showToast]);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const buy = useCallback((id: string) => {
    const product = getProduct(id);
    if (!product) return false;
    setOwned((list) => (list.includes(id) ? list : [...list, id]));
    setOrders((list) =>
      list.some((order) => order.productId === id)
        ? list
        : [{ id: `o-${Date.now()}`, productId: id, price: product.price, at: Date.now() }, ...list],
    );
    return true;
  }, []);

  const addPost = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setExtraPosts((list) => [
      {
        id: `me-${Date.now()}`,
        creatorId: ME_CREATOR_ID,
        text: trimmed,
        time: 'à l’instant',
      },
      ...list,
    ]);
  }, []);

  const value = useMemo<Store>(
    () => ({
      ready,
      user,
      favorites,
      owned,
      following,
      orders,
      likedPosts,
      posts: [...extraPosts, ...CLUB_POSTS],
      notifs,
      toast,
      login,
      logout,
      updateName: (name) => setUser((current) => (current ? { ...current, name } : current)),
      toggleFavorite: (id) => setFavorites((list) => toggleId(list, id)),
      buy,
      toggleFollow: (id) => setFollowing((list) => toggleId(list, id)),
      togglePostLike: (id) => setLikedPosts((list) => toggleId(list, id)),
      addPost,
      setNotifs,
      isFavorite: (id) => favorites.includes(id),
      isOwned: (id) => owned.includes(id),
      isFollowing: (id) => following.includes(id),
      isPostLiked: (id) => likedPosts.includes(id),
      showToast,
      clearToast: () => setToast(null),
    }),
    [
      ready,
      user,
      favorites,
      owned,
      following,
      orders,
      likedPosts,
      extraPosts,
      notifs,
      toast,
      login,
      logout,
      buy,
      addPost,
      showToast,
    ],
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
