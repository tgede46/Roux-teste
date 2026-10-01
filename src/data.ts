import { colors } from './theme';

export type CategoryId = 'Jungle' | 'Starship' | 'Coral' | 'Lavender';

export type Creator = {
  id: string;
  name: string;
  meta: string;
  color: string;
  bio: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  category: CategoryId;
  creatorId: string;
  art: string;
  infoBg: string;
  lightText?: boolean;
  blurb: string;
};

export type ClubPost = {
  id: string;
  creatorId: string;
  text: string;
  time: string;
};

export const CATEGORIES: {
  id: CategoryId;
  color: string;
  icon: 'leaf' | 'rocket' | 'cafe' | 'flower';
}[] = [
  { id: 'Jungle', color: colors.jungle, icon: 'leaf' },
  { id: 'Starship', color: colors.starship, icon: 'rocket' },
  { id: 'Coral', color: colors.coral, icon: 'cafe' },
  { id: 'Lavender', color: colors.lavender, icon: 'flower' },
];

export const CREATORS: Creator[] = [
  {
    id: 'mina',
    name: 'Mina Studio',
    meta: 'Illustration & objets',
    color: colors.teal,
    bio: 'Affiches, stickers et petits objets dessinés à la main, entre jungle et pastel.',
  },
  {
    id: 'roux',
    name: 'Roux Atelier',
    meta: 'Design indépendant',
    color: colors.starship,
    bio: 'Studio indépendant. Typo pixel, packs graphiques et éditions limitées.',
  },
  {
    id: 'leo',
    name: 'Léo Enfantt',
    meta: 'Musique & vidéo',
    color: colors.lavender,
    bio: 'Loops, textures sonores et mini-films pour créateurs Roux.',
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'affiche-jungle',
    name: 'Affiche Jungle',
    price: 12,
    category: 'Jungle',
    creatorId: 'mina',
    art: colors.jungle,
    infoBg: colors.cream,
    blurb: 'A3 riso, tigre pixel et feuillage. Édition de 50.',
  },
  {
    id: 'pack-textures',
    name: 'Pack textures',
    price: 8,
    category: 'Coral',
    creatorId: 'roux',
    art: colors.coral,
    infoBg: colors.jungle,
    lightText: true,
    blurb: '24 grains, papiers et overlays pour tes visuels.',
  },
  {
    id: 'badge-starship',
    name: 'Badge Starship',
    price: 6,
    category: 'Starship',
    creatorId: 'roux',
    art: colors.starship,
    infoBg: colors.cream,
    blurb: 'Pin émaillé fusée, édition Roux Club.',
  },
  {
    id: 'loop-lavender',
    name: 'Loop Lavender',
    price: 9,
    category: 'Lavender',
    creatorId: 'leo',
    art: colors.lavender,
    infoBg: colors.cream,
    blurb: 'Pack de 8 loops dream-pop, 90 BPM.',
  },
];

export const CLUB_POSTS: ClubPost[] = [
  {
    id: 'p1',
    creatorId: 'mina',
    text: 'Nouvelle affiche Jungle en précommande jusqu’à dimanche.',
    time: 'il y a 2 h',
  },
  {
    id: 'p2',
    creatorId: 'roux',
    text: 'On drop un pack typo EB Garamond ce soir à 19h.',
    time: 'il y a 5 h',
  },
  {
    id: 'p3',
    creatorId: 'leo',
    text: 'Session live textures sonores demain, lien dans le Club.',
    time: 'hier',
  },
];

export function getCreator(id: string) {
  return CREATORS.find((creator) => creator.id === id);
}

export function getProduct(id: string) {
  return PRODUCTS.find((product) => product.id === id);
}

export function productsByCreator(id: string) {
  return PRODUCTS.filter((product) => product.creatorId === id);
}
