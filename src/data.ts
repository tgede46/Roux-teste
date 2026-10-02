import type { ImageSourcePropType } from 'react-native';
import { colors } from './theme';

export type CategoryId = 'Jungle' | 'Starship' | 'Coral' | 'Lavender';

export type Creator = {
  id: string;
  name: string;
  meta: string;
  color: string;
  bio: string;
  photo: ImageSourcePropType;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  category: CategoryId;
  creatorId: string;
  art: string;
  image: ImageSourcePropType;
  infoBg: string;
  lightText?: boolean;
  blurb: string;
  details: string;
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
  image: ImageSourcePropType;
}[] = [
  { id: 'Jungle', color: colors.jungle, icon: 'leaf', image: require('../assets/images/cat-jungle.jpg') },
  { id: 'Starship', color: colors.starship, icon: 'rocket', image: require('../assets/images/cat-starship.jpg') },
  { id: 'Coral', color: colors.coral, icon: 'cafe', image: require('../assets/images/cat-coral.jpg') },
  { id: 'Lavender', color: colors.lavender, icon: 'flower', image: require('../assets/images/cat-lavender.jpg') },
];

export const CREATORS: Creator[] = [
  {
    id: 'mina',
    name: 'Mina Studio',
    meta: 'Illustration & objets',
    color: colors.teal,
    photo: require('../assets/images/mina.jpg'),
    bio: 'Affiches, stickers et petits objets dessinés à la main, entre jungle et pastel.',
  },
  {
    id: 'roux',
    name: 'Roux Atelier',
    meta: 'Design indépendant',
    color: colors.starship,
    photo: require('../assets/images/roux.jpg'),
    bio: 'Studio indépendant. Typo pixel, packs graphiques et éditions limitées.',
  },
  {
    id: 'leo',
    name: 'Léo Enfantt',
    meta: 'Musique & vidéo',
    color: colors.lavender,
    photo: require('../assets/images/leo.jpg'),
    bio: 'Loops, textures sonores et mini-films pour créateurs Roux.',
  },
  {
    id: 'nora',
    name: 'Nora Print',
    meta: 'Riso & papeterie',
    color: colors.jungle,
    photo: require('../assets/images/nora.jpg'),
    bio: 'Impressions riso, carnets et cartes. Petites séries, gros grains.',
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
    image: require('../assets/images/jungle.jpg'),
    infoBg: colors.cream,
    blurb: 'A3 riso, tigre pixel et feuillage. Édition de 50.',
    details: 'Papier Munken 170 g. Signée et numérotée. Livraison numérique de la preuve + impression physique en 5 jours.',
  },
  {
    id: 'sticker-tigre',
    name: 'Stickers Tigre',
    price: 5,
    category: 'Jungle',
    creatorId: 'mina',
    art: colors.teal,
    image: require('../assets/images/tigre.jpg'),
    infoBg: colors.cream,
    blurb: 'Planche de 8 stickers vinyl mat.',
    details: 'Vinyl mat, découpe à la forme. Résiste à l’eau. Fichier PNG HD inclus.',
  },
  {
    id: 'pack-textures',
    name: 'Pack textures',
    price: 8,
    category: 'Coral',
    creatorId: 'roux',
    art: colors.coral,
    image: require('../assets/images/textures.jpg'),
    infoBg: colors.jungle,
    lightText: true,
    blurb: '24 grains, papiers et overlays pour tes visuels.',
    details: 'PNG 4K + .abr Photoshop. Licence personnelle et commerciale petite équipe.',
  },
  {
    id: 'typo-pixel',
    name: 'Typo Pixel Roux',
    price: 14,
    category: 'Starship',
    creatorId: 'roux',
    art: colors.starship,
    image: require('../assets/images/typo.jpg'),
    infoBg: colors.cream,
    blurb: 'Police display 3 graisses, accents FR.',
    details: 'OTF + WOFF2. Usage desktop et web jusqu’à 10k vues / mois.',
  },
  {
    id: 'badge-starship',
    name: 'Badge Starship',
    price: 6,
    category: 'Starship',
    creatorId: 'roux',
    art: colors.starship,
    image: require('../assets/images/starship.jpg'),
    infoBg: colors.cream,
    blurb: 'Pin émaillé fusée, édition Roux Club.',
    details: 'Pin 25 mm, attache papillon. Édition Roux Club, 120 pièces.',
  },
  {
    id: 'loop-lavender',
    name: 'Loop Lavender',
    price: 9,
    category: 'Lavender',
    creatorId: 'leo',
    art: colors.lavender,
    image: require('../assets/images/lavender.jpg'),
    infoBg: colors.cream,
    blurb: 'Pack de 8 loops dream-pop, 90 BPM.',
    details: 'WAV 24-bit + stems drums / pad / vocal. Royalty-free pour tes films Roux.',
  },
  {
    id: 'film-grain',
    name: 'Mini-film Grain',
    price: 11,
    category: 'Lavender',
    creatorId: 'leo',
    art: colors.lavender,
    image: require('../assets/images/film.jpg'),
    infoBg: colors.cream,
    blurb: 'Clip 12 s, overlays analogiques.',
    details: 'ProRes + MP4. Utilisable en intro, reel ou fond de live.',
  },
  {
    id: 'carnet-riso',
    name: 'Carnet Riso',
    price: 10,
    category: 'Coral',
    creatorId: 'nora',
    art: colors.coral,
    image: require('../assets/images/carnet.jpg'),
    infoBg: colors.cream,
    blurb: 'Carnet A6, 48 pages, deux encres.',
    details: 'Couverture 300 g, intérieur 120 g. Imprimé à 80 exemplaires.',
  },
  {
    id: 'cartes-jungle',
    name: 'Cartes Jungle',
    price: 7,
    category: 'Jungle',
    creatorId: 'nora',
    art: colors.jungle,
    image: require('../assets/images/cartes.jpg'),
    infoBg: colors.cream,
    blurb: 'Set de 6 cartes postales riso.',
    details: 'Format A6, deux passages d’encre. Enveloppe kraft incluse.',
  },
  {
    id: 'pack-icones',
    name: 'Pack icônes',
    price: 6,
    category: 'Starship',
    creatorId: 'mina',
    art: colors.starship,
    image: require('../assets/images/icones.jpg'),
    infoBg: colors.cream,
    blurb: '40 pictos pixel pour tes stories.',
    details: 'SVG + PNG @2x. Licence pour un compte et un site.',
  },
];

export const CLUB_POSTS: ClubPost[] = [
  {
    id: 'p1',
    creatorId: 'mina',
    text: 'Nouvelle affiche Jungle en précommande jusqu’à dimanche. Les 20 premières sont signées.',
    time: 'il y a 2 h',
  },
  {
    id: 'p2',
    creatorId: 'roux',
    text: 'On drop un pack typo EB Garamond ce soir à 19h. Lien dans la boutique dès l’heure pile.',
    time: 'il y a 5 h',
  },
  {
    id: 'p3',
    creatorId: 'leo',
    text: 'Session live textures sonores demain. Replay dans le Club pour les suivis.',
    time: 'hier',
  },
  {
    id: 'p4',
    creatorId: 'nora',
    text: 'Le carnet Riso Coral est rentré. Il en reste 18, ensuite on referme la série.',
    time: 'hier',
  },
];

export const ME_CREATOR_ID = 'me';

export function getCreator(id: string) {
  return CREATORS.find((creator) => creator.id === id);
}

export function getProduct(id: string) {
  return PRODUCTS.find((product) => product.id === id);
}

export function productsByCreator(id: string) {
  return PRODUCTS.filter((product) => product.creatorId === id);
}

export function relatedProducts(product: Product, limit = 3) {
  return PRODUCTS.filter(
    (item) =>
      item.id !== product.id &&
      (item.creatorId === product.creatorId || item.category === product.category),
  ).slice(0, limit);
}

export function firstName(name: string) {
  return name.trim().split(/\s+/)[0] || 'toi';
}
