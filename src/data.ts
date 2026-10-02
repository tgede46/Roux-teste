import type { ImageSourcePropType } from 'react-native';
import { colors } from './theme';

export type CategoryId = 'Jungle' | 'Starship' | 'Coral' | 'Lavender';

export type Tier = {
  id: string;
  name: string;
  price: number;
  perks: string;
};

export type Creator = {
  id: string;
  name: string;
  meta: string;
  color: string;
  bio: string;
  photo: ImageSourcePropType;
  tiers: Tier[];
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
  includedAt?: number;
};

export type FileKind = 'image' | 'audio' | 'video' | 'pack' | 'print';

export type ProductFile = {
  kind: FileKind;
  fileName: string;
  licence: string;
  items: string[];
  pages?: ImageSourcePropType[];
  mediaUri?: string;
};

export type ClubPost = {
  id: string;
  creatorId: string;
  text: string;
  time: string;
  minPrice: number;
};

function tiers(names: [string, string, string], perks: [string, string, string]): Tier[] {
  return [
    { id: 't4', name: names[0], price: 4, perks: perks[0] },
    { id: 't8', name: names[1], price: 8, perks: perks[1] },
    { id: 't12', name: names[2], price: 12, perks: perks[2] },
  ];
}

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
    tiers: tiers(
      ['Feuillage', 'Jungle', 'Atelier'],
      ['Posts Club', 'Affiches digitales + Club', 'Tout + éditions signées'],
    ),
  },
  {
    id: 'roux',
    name: 'Roux Atelier',
    meta: 'Design indépendant',
    color: colors.starship,
    photo: require('../assets/images/roux.jpg'),
    bio: 'Studio indépendant. Typo pixel, packs graphiques et éditions limitées.',
    tiers: tiers(
      ['Pixel', 'Atelier', 'Foundry'],
      ['Teasers Club', 'Packs graphiques du mois', 'Typo + textures + drops'],
    ),
  },
  {
    id: 'leo',
    name: 'Léo Enfantt',
    meta: 'Musique & vidéo',
    color: colors.lavender,
    photo: require('../assets/images/leo.jpg'),
    bio: 'Loops, textures sonores et mini-films pour créateurs Roux.',
    tiers: tiers(
      ['Loops', 'Session', 'Stem'],
      ['Loops du mois', 'Sessions live + replay', 'Stems et mini-films'],
    ),
  },
  {
    id: 'nora',
    name: 'Nora Print',
    meta: 'Riso & papeterie',
    color: colors.jungle,
    photo: require('../assets/images/nora.jpg'),
    bio: 'Impressions riso, carnets et cartes. Petites séries, gros grains.',
    tiers: tiers(
      ['Cartes', 'Riso', 'Print'],
      ['Cartes digitales', 'Carnets scans HD', 'Fichiers print + série'],
    ),
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
    includedAt: 8,
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
    includedAt: 4,
  },
  {
    id: 'pack-textures',
    name: 'Pack textures',
    price: 8,
    category: 'Coral',
    creatorId: 'roux',
    art: colors.coral,
    image: require('../assets/images/textures.jpg'),
    infoBg: colors.cream,
    blurb: '24 grains, papiers et overlays pour tes visuels.',
    details: 'PNG 4K + .abr Photoshop. Licence personnelle et commerciale petite équipe.',
    includedAt: 12,
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
    includedAt: 12,
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
    includedAt: 8,
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
    includedAt: 12,
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
    includedAt: 4,
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
    includedAt: 8,
  },
];

const SAMPLE_VIDEO =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
const SAMPLE_AUDIO =
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

export const PRODUCT_FILES: Record<string, ProductFile> = {
  'affiche-jungle': {
    kind: 'image',
    fileName: 'Affiche-Jungle-A3.pdf',
    licence: 'Personnelle + impression unique. Pas de revente du fichier.',
    items: ['PDF print A3 300 dpi', 'PNG preview web'],
    pages: [require('../assets/images/jungle.jpg')],
  },
  'sticker-tigre': {
    kind: 'image',
    fileName: 'Stickers-Tigre.png',
    licence: 'Usage perso et stories. Pas de merch sans accord Mina.',
    items: ['PNG HD planche', 'Fichiers découpe SVG'],
    pages: [require('../assets/images/tigre.jpg')],
  },
  'pack-textures': {
    kind: 'pack',
    fileName: 'Roux-Textures.zip',
    licence: 'Commerciale petite équipe (≤ 5 personnes).',
    items: ['24 PNG 4K', '1 set .abr Photoshop', 'Readme licence'],
    pages: [
      require('../assets/images/textures.jpg'),
      require('../assets/images/jungle.jpg'),
      require('../assets/images/starship.jpg'),
    ],
  },
  'typo-pixel': {
    kind: 'pack',
    fileName: 'Typo-Pixel-Roux.zip',
    licence: 'Desktop + web jusqu’à 10k vues / mois.',
    items: ['OTF Regular / Medium / Bold', 'WOFF2', 'Specimen PDF'],
    pages: [require('../assets/images/typo.jpg')],
  },
  'badge-starship': {
    kind: 'print',
    fileName: 'Badge-Starship-bon.pdf',
    licence: 'Objet physique. Le PDF est le bon d’édition, pas le pin.',
    items: ['Bon de commande n° RC-120', 'Visuel 25 mm'],
    pages: [require('../assets/images/starship.jpg')],
  },
  'loop-lavender': {
    kind: 'audio',
    fileName: 'Loop-Lavender.zip',
    licence: 'Royalty-free pour tes films et lives Roux.',
    items: ['8 loops WAV 24-bit', 'Stems drums / pad / vocal'],
    pages: [require('../assets/images/lavender.jpg')],
    mediaUri: SAMPLE_AUDIO,
  },
  'film-grain': {
    kind: 'video',
    fileName: 'Mini-film-Grain.mp4',
    licence: 'Intro, reel, fond de live. Pas de revente du clip seul.',
    items: ['MP4 1080p', 'ProRes (lien Library)'],
    pages: [require('../assets/images/film.jpg')],
    mediaUri: SAMPLE_VIDEO,
  },
  'carnet-riso': {
    kind: 'print',
    fileName: 'Carnet-Riso-scan.pdf',
    licence: 'Objet physique. Le scan HD est pour archive membre / acheteur.',
    items: ['Scan 48 pages PDF', 'Suivi d’expédition simulé'],
    pages: [
      require('../assets/images/carnet.jpg'),
      require('../assets/images/cartes.jpg'),
      require('../assets/images/jungle.jpg'),
    ],
  },
  'cartes-jungle': {
    kind: 'image',
    fileName: 'Cartes-Jungle.pdf',
    licence: 'Impression perso. Pas de revente des fichiers.',
    items: ['6 cartes A6 PDF', 'PNG web'],
    pages: [require('../assets/images/cartes.jpg'), require('../assets/images/jungle.jpg')],
  },
  'pack-icones': {
    kind: 'pack',
    fileName: 'Pack-Icones-Mina.zip',
    licence: 'Un compte + un site.',
    items: ['40 SVG', '40 PNG @2x'],
    pages: [require('../assets/images/icones.jpg'), require('../assets/images/tigre.jpg')],
  },
};

export function getProductFile(productId: string) {
  return PRODUCT_FILES[productId];
}

export function fileKindLabel(kind: FileKind) {
  switch (kind) {
    case 'audio':
      return 'Audio';
    case 'video':
      return 'Vidéo';
    case 'pack':
      return 'Pack';
    case 'print':
      return 'Document';
    case 'image':
      return 'Document';
    default:
      return 'Fichier';
  }
}

export const CLUB_POSTS: ClubPost[] = [
  {
    id: 'p1',
    creatorId: 'mina',
    text: 'Nouvelle affiche Jungle en précommande jusqu’à dimanche. Les 20 premières sont signées.',
    time: 'il y a 2 h',
    minPrice: 0,
  },
  {
    id: 'p1b',
    creatorId: 'mina',
    text: 'Fichiers A3 + calques pour les membres Jungle. Lien de téléchargement dans Library.',
    time: 'il y a 3 h',
    minPrice: 8,
  },
  {
    id: 'p2',
    creatorId: 'roux',
    text: 'On drop un pack typo Noto Sans ce soir à 19h. Lien dans la boutique dès l’heure pile.',
    time: 'il y a 5 h',
    minPrice: 0,
  },
  {
    id: 'p2b',
    creatorId: 'roux',
    text: 'OTF + licence Foundry : usage web jusqu’à 50k vues, déjà dans ta Library si tu es palier 12 €.',
    time: 'il y a 6 h',
    minPrice: 12,
  },
  {
    id: 'p3',
    creatorId: 'leo',
    text: 'Session live textures sonores demain. Replay dans le Club pour les membres Loops.',
    time: 'hier',
    minPrice: 4,
  },
  {
    id: 'p3b',
    creatorId: 'leo',
    text: 'Stems du Mini-film Grain : drums / pad / vocal séparés, palier Stem uniquement.',
    time: 'hier',
    minPrice: 12,
  },
  {
    id: 'p4',
    creatorId: 'nora',
    text: 'Le carnet Riso Coral est rentré. Il en reste 18, ensuite on referme la série.',
    time: 'hier',
    minPrice: 0,
  },
  {
    id: 'p4b',
    creatorId: 'nora',
    text: 'Scans HD des 48 pages pour le palier Riso. Imprime chez toi ou archive.',
    time: 'hier',
    minPrice: 8,
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

export function tierByPrice(creator: Creator, price: number) {
  return creator.tiers.find((tier) => tier.price === price);
}

export function isIncludedInTier(product: Product, memberPrice: number | null | undefined) {
  if (product.includedAt == null || memberPrice == null) return false;
  return memberPrice >= product.includedAt;
}

export function canReadPost(post: ClubPost, memberPrice: number | null | undefined) {
  if (post.creatorId === ME_CREATOR_ID || post.minPrice === 0) return true;
  return (memberPrice ?? 0) >= post.minPrice;
}

export type DropKind = 'product' | 'club' | 'live';

export type Drop = {
  id: string;
  creatorId: string;
  productId?: string;
  title: string;
  time: string;
  kind: DropKind;
};

export const DROPS: Drop[] = [
  {
    id: 'd1',
    creatorId: 'mina',
    productId: 'affiche-jungle',
    title: 'Drop Affiche Jungle — édition 50',
    time: 'il y a 2 h',
    kind: 'product',
  },
  {
    id: 'd2',
    creatorId: 'mina',
    title: 'Calques A3 dans le Club Jungle',
    time: 'il y a 3 h',
    kind: 'club',
  },
  {
    id: 'd3',
    creatorId: 'roux',
    productId: 'typo-pixel',
    title: 'Typo Pixel Roux à 19h',
    time: 'il y a 5 h',
    kind: 'product',
  },
  {
    id: 'd4',
    creatorId: 'leo',
    productId: 'loop-lavender',
    title: 'Live textures demain + Loop Lavender',
    time: 'hier',
    kind: 'live',
  },
  {
    id: 'd5',
    creatorId: 'nora',
    productId: 'carnet-riso',
    title: 'Carnet Riso Coral rentré (18 left)',
    time: 'hier',
    kind: 'product',
  },
];

export function dropKindLabel(kind: DropKind) {
  if (kind === 'live') return 'Live';
  if (kind === 'club') return 'Club';
  return 'Drop';
}

export function productsForMembers(memberships: Record<string, number>) {
  const ids = Object.keys(memberships);
  return PRODUCTS.filter((product) => ids.includes(product.creatorId));
}

export function dropsForMembers(memberships: Record<string, number>) {
  return DROPS.filter((drop) => memberships[drop.creatorId] != null);
}
