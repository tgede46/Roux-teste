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
import {
  CLUB_POSTS,
  DROPS,
  getCreator,
  getProduct,
  ME_CREATOR_ID,
  isIncludedInTier,
  type ClubPost,
} from './data';

const STORAGE_KEY = 'roux-store-v2';

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

export type AccessKind = 'purchase' | 'member' | null;

type Toast = {
  message: string;
};

type Store = {
  ready: boolean;
  user: User | null;
  favorites: string[];
  owned: string[];
  following: string[];
  memberships: Record<string, number>;
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
  subscribe: (creatorId: string, price: number) => void;
  unsubscribe: (creatorId: string) => void;
  toggleFollow: (id: string) => void;
  togglePostLike: (id: string) => void;
  addPost: (text: string) => void;
  setNotifs: (value: boolean) => void;
  isFavorite: (id: string) => boolean;
  isOwned: (id: string) => boolean;
  isFollowing: (id: string) => boolean;
  isMember: (creatorId: string) => boolean;
  memberPrice: (creatorId: string) => number | null;
  hasProductAccess: (productId: string) => boolean;
  accessKind: (productId: string) => AccessKind;
  opened: string[];
  markOpened: (productId: string) => void;
  isOpened: (productId: string) => boolean;
  isPostLiked: (id: string) => boolean;
  readDropIds: string[];
  unreadDropCount: number;
  markDropRead: (id: string) => void;
  markAllDropsRead: () => void;
  showToast: (message: string) => void;
  clearToast: () => void;
};

type Persisted = {
  user: User | null;
  favorites: string[];
  owned: string[];
  following: string[];
  memberships: Record<string, number>;
  orders: Order[];
  likedPosts: string[];
  extraPosts: ClubPost[];
  opened: string[];
  readDropIds: string[];
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
  memberships: {},
  orders: [],
  likedPosts: [],
  extraPosts: [],
  opened: [],
  readDropIds: [],
  notifs: true,
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<string[]>(defaults.favorites);
  const [owned, setOwned] = useState<string[]>([]);
  const [following, setFollowing] = useState<string[]>(defaults.following);
  const [memberships, setMemberships] = useState<Record<string, number>>({});
  const [orders, setOrders] = useState<Order[]>([]);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [extraPosts, setExtraPosts] = useState<ClubPost[]>([]);
  const [opened, setOpened] = useState<string[]>([]);
  const [readDropIds, setReadDropIds] = useState<string[]>([]);
  const [notifs, setNotifsState] = useState(true);
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
        if (parsed.memberships) setMemberships(parsed.memberships);
        if (parsed.orders) setOrders(parsed.orders);
        if (parsed.likedPosts) setLikedPosts(parsed.likedPosts);
        if (parsed.extraPosts) setExtraPosts(parsed.extraPosts);
        if (parsed.opened) setOpened(parsed.opened);
        if (parsed.readDropIds) setReadDropIds(parsed.readDropIds);
        if (typeof parsed.notifs === 'boolean') setNotifsState(parsed.notifs);
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
      memberships,
      orders,
      likedPosts,
      extraPosts,
      opened,
      readDropIds,
      notifs,
    };
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload)).catch(() => undefined);
  }, [ready, user, favorites, owned, following, memberships, orders, likedPosts, extraPosts, opened, readDropIds, notifs]);

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

  const subscribe = useCallback(
    (creatorId: string, price: number) => {
      setMemberships((current) => ({ ...current, [creatorId]: price }));
      setFollowing((list) => (list.includes(creatorId) ? list : [...list, creatorId]));
      if (notifs) {
        const name = getCreator(creatorId)?.name ?? 'Atelier';
        showToast(`${name} droppe dans Pour toi`);
      }
    },
    [notifs, showToast],
  );

  const setNotifs = useCallback((value: boolean) => {
    setNotifsState(value);
  }, []);

  const markDropRead = useCallback((id: string) => {
    setReadDropIds((list) => (list.includes(id) ? list : [...list, id]));
  }, []);

  const markAllDropsRead = useCallback(() => {
    setReadDropIds(DROPS.map((drop) => drop.id));
  }, []);

  const unreadDropCount = useMemo(() => {
    if (!notifs) return 0;
    const memberIds = Object.keys(memberships);
    return DROPS.filter((drop) => memberIds.includes(drop.creatorId) && !readDropIds.includes(drop.id))
      .length;
  }, [notifs, memberships, readDropIds]);

  const unsubscribe = useCallback((creatorId: string) => {
    setMemberships((current) => {
      const next = { ...current };
      delete next[creatorId];
      return next;
    });
  }, []);

  const memberPrice = useCallback(
    (creatorId: string) => memberships[creatorId] ?? null,
    [memberships],
  );

  const hasProductAccess = useCallback(
    (productId: string) => {
      if (owned.includes(productId)) return true;
      const product = getProduct(productId);
      if (!product) return false;
      return isIncludedInTier(product, memberships[product.creatorId] ?? null);
    },
    [owned, memberships],
  );

  const accessKind = useCallback(
    (productId: string): AccessKind => {
      if (owned.includes(productId)) return 'purchase';
      const product = getProduct(productId);
      if (!product) return null;
      if (isIncludedInTier(product, memberships[product.creatorId] ?? null)) return 'member';
      return null;
    },
    [owned, memberships],
  );

  const markOpened = useCallback((productId: string) => {
    setOpened((list) => (list.includes(productId) ? list : [...list, productId]));
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
        minPrice: 0,
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
      memberships,
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
      subscribe,
      unsubscribe,
      toggleFollow: (id) => setFollowing((list) => toggleId(list, id)),
      togglePostLike: (id) => setLikedPosts((list) => toggleId(list, id)),
      addPost,
      setNotifs,
      isFavorite: (id) => favorites.includes(id),
      isOwned: (id) => owned.includes(id),
      isFollowing: (id) => following.includes(id),
      isMember: (creatorId) => memberships[creatorId] != null,
      memberPrice,
      hasProductAccess,
      accessKind,
      opened,
      markOpened,
      isOpened: (id) => opened.includes(id),
      isPostLiked: (id) => likedPosts.includes(id),
      readDropIds,
      unreadDropCount,
      markDropRead,
      markAllDropsRead,
      showToast,
      clearToast: () => setToast(null),
    }),
    [
      ready,
      user,
      favorites,
      owned,
      following,
      memberships,
      orders,
      likedPosts,
      extraPosts,
      opened,
      readDropIds,
      notifs,
      toast,
      login,
      logout,
      buy,
      subscribe,
      unsubscribe,
      memberPrice,
      hasProductAccess,
      accessKind,
      markOpened,
      unreadDropCount,
      markDropRead,
      markAllDropsRead,
      addPost,
      setNotifs,
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
