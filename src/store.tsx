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
import { hashSecret, secretsMatch } from './auth';
import {
  CLUB_POSTS,
  DROPS,
  getCreator,
  getProduct,
  ME_CREATOR_ID,
  isIncludedInTier,
  type ClubPost,
  type Drop,
  type DropKind,
} from './data';
import type { ChargeOk } from './payment';

const STORAGE_KEY = 'roux-store-v3';

export type User = {
  name: string;
  email: string;
};

export type Account = {
  email: string;
  name: string;
  passwordHash: string;
};

export type Order = {
  id: string;
  kind: 'product' | 'membership';
  productId?: string;
  creatorId?: string;
  price: number;
  at: number;
  last4: string;
  brand: string;
};

export type AccessKind = 'purchase' | 'member' | null;

export type AuthResult = { ok: true } | { ok: false; error: string };

type Toast = {
  message: string;
};

type ProfileSlice = {
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
  drops: Drop[];
  notifs: boolean;
  toast: Toast | null;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (name: string, email: string, password: string) => Promise<AuthResult>;
  resetPassword: (email: string, password: string) => Promise<AuthResult>;
  logout: () => void;
  updateName: (name: string) => void;
  toggleFavorite: (id: string) => void;
  buy: (id: string, charge: ChargeOk) => boolean;
  subscribe: (creatorId: string, price: number, charge: ChargeOk) => void;
  unsubscribe: (creatorId: string) => void;
  toggleFollow: (id: string) => void;
  togglePostLike: (id: string) => void;
  addPost: (text: string, minPrice?: number) => void;
  addDrop: (input: { title: string; kind: DropKind; productId?: string }) => void;
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
  accounts: Account[];
  profiles: Record<string, ProfileSlice>;
  sessionEmail: string | null;
  extraPosts: ClubPost[];
  extraDrops: Drop[];
};

const StoreContext = createContext<Store | null>(null);

function toggleId(list: string[], id: string) {
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

const emptyProfile: ProfileSlice = {
  favorites: [],
  owned: [],
  following: [],
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
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [profiles, setProfiles] = useState<Record<string, ProfileSlice>>({});
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<string[]>(emptyProfile.favorites);
  const [owned, setOwned] = useState<string[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [memberships, setMemberships] = useState<Record<string, number>>({});
  const [orders, setOrders] = useState<Order[]>([]);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [extraPosts, setExtraPosts] = useState<ClubPost[]>([]);
  const [extraDrops, setExtraDrops] = useState<Drop[]>([]);
  const [opened, setOpened] = useState<string[]>([]);
  const [readDropIds, setReadDropIds] = useState<string[]>([]);
  const [notifs, setNotifsState] = useState(true);
  const [toast, setToast] = useState<Toast | null>(null);

  const applyProfile = useCallback((slice: ProfileSlice | undefined) => {
    const next = slice ?? emptyProfile;
    setFavorites(next.favorites);
    setOwned(next.owned);
    setFollowing(next.following);
    setMemberships(next.memberships);
    setOrders(next.orders);
    setLikedPosts(next.likedPosts);
    setOpened(next.opened);
    setReadDropIds(next.readDropIds);
    setNotifsState(next.notifs);
  }, []);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (cancelled || !raw) return;
        const parsed = JSON.parse(raw) as Partial<Persisted>;
        const nextAccounts = parsed.accounts ?? [];
        const nextProfiles = parsed.profiles ?? {};
        if (cancelled) return;
        setAccounts(nextAccounts);
        setProfiles(nextProfiles);
        const fromProfiles = Object.values(nextProfiles).flatMap((slice) => slice.extraPosts ?? []);
        const nextPosts = [...(parsed.extraPosts ?? []), ...fromProfiles];
        const seen = new Set<string>();
        setExtraPosts(
          nextPosts.filter((post) => {
            if (seen.has(post.id)) return false;
            seen.add(post.id);
            return true;
          }),
        );
        if (parsed.extraDrops) setExtraDrops(parsed.extraDrops);
        const session = parsed.sessionEmail;
        const account = nextAccounts.find((item) => item.email === session);
        if (account) {
          applyProfile(nextProfiles[account.email]);
          setUser({ name: account.name, email: account.email });
        }
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [applyProfile]);

  useEffect(() => {
    if (!ready) return;
    const nextProfiles = { ...profiles };
    if (user) {
      nextProfiles[user.email] = {
        favorites,
        owned,
        following,
        memberships,
        orders,
        likedPosts,
        extraPosts: [],
        opened,
        readDropIds,
        notifs,
      };
    }
    const payload: Persisted = {
      accounts,
      profiles: nextProfiles,
      sessionEmail: user?.email ?? null,
      extraPosts,
      extraDrops,
    };
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload)).catch(() => undefined);
  }, [
    ready,
    accounts,
    profiles,
    user,
    favorites,
    owned,
    following,
    memberships,
    orders,
    likedPosts,
    extraPosts,
    extraDrops,
    opened,
    readDropIds,
    notifs,
  ]);

  const showToast = useCallback((message: string) => {
    setToast({ message });
  }, []);

  const signIn = useCallback(
    async (emailValue: string, password: string): Promise<AuthResult> => {
      const email = normalizeEmail(emailValue);
      const account = accounts.find((item) => item.email === email);
      if (!account) return { ok: false, error: 'Aucun compte pour cet email.' };
      const match = await secretsMatch(email, password, account.passwordHash);
      if (!match) return { ok: false, error: 'Mot de passe incorrect.' };
      applyProfile(profiles[email]);
      setUser({ name: account.name, email });
      showToast(`Salut ${account.name.split(' ')[0]}`);
      return { ok: true };
    },
    [accounts, profiles, applyProfile, showToast],
  );

  const signUp = useCallback(
    async (name: string, emailValue: string, password: string): Promise<AuthResult> => {
      const email = normalizeEmail(emailValue);
      if (accounts.some((item) => item.email === email)) {
        return { ok: false, error: 'Un compte existe déjà. Connecte-toi.' };
      }
      const passwordHash = await hashSecret(email, password);
      const account: Account = { email, name: name.trim(), passwordHash };
      setAccounts((list) => [...list, account]);
      setProfiles((current) => ({ ...current, [email]: emptyProfile }));
      applyProfile(emptyProfile);
      setUser({ name: account.name, email });
      showToast(`Salut ${account.name.split(' ')[0]}`);
      return { ok: true };
    },
    [accounts, applyProfile, showToast],
  );

  const resetPassword = useCallback(
    async (emailValue: string, password: string): Promise<AuthResult> => {
      const email = normalizeEmail(emailValue);
      const account = accounts.find((item) => item.email === email);
      if (!account) return { ok: false, error: 'Aucun compte pour cet email.' };
      const passwordHash = await hashSecret(email, password);
      setAccounts((list) =>
        list.map((item) => (item.email === email ? { ...item, passwordHash } : item)),
      );
      return { ok: true };
    },
    [accounts],
  );

  const logout = useCallback(() => {
    if (user) {
      setProfiles((current) => ({
        ...current,
        [user.email]: {
          favorites,
          owned,
          following,
          memberships,
          orders,
          likedPosts,
          extraPosts: [],
          opened,
          readDropIds,
          notifs,
        },
      }));
    }
    setUser(null);
    applyProfile(emptyProfile);
  }, [
    user,
    favorites,
    owned,
    following,
    memberships,
    orders,
    likedPosts,
    opened,
    readDropIds,
    notifs,
    applyProfile,
  ]);

  const buy = useCallback((id: string, charge: ChargeOk) => {
    const product = getProduct(id);
    if (!product) return false;
    let added = false;
    setOwned((list) => {
      if (list.includes(id)) return list;
      added = true;
      return [...list, id];
    });
    setOrders((list) => {
      if (list.some((order) => order.kind === 'product' && order.productId === id)) return list;
      return [
        {
          id: `o-${Date.now()}`,
          kind: 'product',
          productId: id,
          creatorId: product.creatorId,
          price: product.price,
          at: Date.now(),
          last4: charge.last4,
          brand: charge.brand,
        },
        ...list,
      ];
    });
    return added || true;
  }, []);

  const subscribe = useCallback(
    (creatorId: string, price: number, charge: ChargeOk) => {
      setMemberships((current) => ({ ...current, [creatorId]: price }));
      setFollowing((list) => (list.includes(creatorId) ? list : [...list, creatorId]));
      setOrders((list) => [
        {
          id: `m-${Date.now()}`,
          kind: 'membership',
          creatorId,
          price,
          at: Date.now(),
          last4: charge.last4,
          brand: charge.brand,
        },
        ...list,
      ]);
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
    setReadDropIds([...extraDrops, ...DROPS].map((drop) => drop.id));
  }, [extraDrops]);

  const drops = useMemo(() => [...extraDrops, ...DROPS], [extraDrops]);

  const unreadDropCount = useMemo(() => {
    if (!notifs) return 0;
    return drops.filter((drop) => {
      const mine = drop.creatorId === ME_CREATOR_ID && drop.authorEmail === user?.email;
      const member = memberships[drop.creatorId] != null;
      return (mine || member) && !readDropIds.includes(drop.id);
    }).length;
  }, [notifs, drops, memberships, readDropIds, user?.email]);

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

  const addPost = useCallback(
    (text: string, minPrice = 0) => {
      const trimmed = text.trim();
      if (!trimmed || !user) return;
      setExtraPosts((list) => [
        {
          id: `me-${Date.now()}`,
          creatorId: ME_CREATOR_ID,
          text: trimmed,
          time: 'à l’instant',
          minPrice,
          authorEmail: user.email,
          authorName: user.name,
        },
        ...list,
      ]);
    },
    [user],
  );

  const addDrop = useCallback(
    (input: { title: string; kind: DropKind; productId?: string }) => {
      const title = input.title.trim();
      if (!title || !user) return;
      setExtraDrops((list) => [
        {
          id: `drop-${Date.now()}`,
          creatorId: ME_CREATOR_ID,
          title,
          time: 'à l’instant',
          kind: input.kind,
          productId: input.productId,
          authorEmail: user.email,
          authorName: user.name,
        },
        ...list,
      ]);
    },
    [user],
  );

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
      drops,
      notifs,
      toast,
      signIn,
      signUp,
      resetPassword,
      logout,
      updateName: (name) => {
        setUser((current) => (current ? { ...current, name } : current));
        setAccounts((list) =>
          list.map((item) => (item.email === user?.email ? { ...item, name } : item)),
        );
      },
      toggleFavorite: (id) => setFavorites((list) => toggleId(list, id)),
      buy,
      subscribe,
      unsubscribe,
      toggleFollow: (id) => setFollowing((list) => toggleId(list, id)),
      togglePostLike: (id) => setLikedPosts((list) => toggleId(list, id)),
      addPost,
      addDrop,
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
      drops,
      opened,
      readDropIds,
      notifs,
      toast,
      signIn,
      signUp,
      resetPassword,
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
      addDrop,
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
