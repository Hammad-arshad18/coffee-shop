export type Category = "single-origin" | "blend" | "decaf";

export interface FlavorMeters {
  acidity: number;
  body: number;
  sweetness: number;
}

export interface Product {
  id: string;
  name: string;
  origin: string;
  category: Category;
  roast: 1 | 2 | 3 | 4 | 5;
  roastLabel: string;
  price: number;
  weight: string;
  notes: string[];
  description: string;
  process: string;
  elevation: string;
  varietal: string;
  producer: string;
  image: string;
  accent: string;
  meters: FlavorMeters;
  brew: string[];
  badge?: string;
  rating: number;
  reviews: number;
}

export interface CartItem {
  id: string;
  qty: number;
}

export const FREE_SHIPPING_THRESHOLD = 40;
export const FLAT_SHIPPING = 6;

export const CATEGORIES: { id: "all" | Category; label: string }[] = [
  { id: "all", label: "All roasts" },
  { id: "single-origin", label: "Single origin" },
  { id: "blend", label: "Blends" },
  { id: "decaf", label: "Decaf" },
];

export const CATEGORY_LABEL: Record<Category, string> = {
  "single-origin": "Single origin",
  blend: "Blend",
  decaf: "Decaf",
};

export const fmt = (n: number): string => `$${n.toFixed(2)}`;

export const products: Product[] = [
  {
    id: "yirgacheffe-dawn",
    name: "Yirgacheffe Dawn",
    origin: "Ethiopia · Gedeb",
    category: "single-origin",
    roast: 2,
    roastLabel: "Light roast",
    price: 21.0,
    weight: "250 g · whole bean",
    notes: ["Bergamot", "Apricot", "Jasmine"],
    description:
      "A washed heirloom lot gathered from smallholders around Gedeb, roasted light to keep the florals loud. It opens tea-delicate with a citrus lift, then settles into a long apricot sweetness that keeps unfolding as the cup cools.",
    process: "Washed",
    elevation: "1,950–2,150 masl",
    varietal: "Heirloom",
    producer: "Gedeb smallholders",
    image: "https://image.qwenlm.ai/generated-images/3e6f76bc-2f5b-4520-a95b-1a363392f10e/_result.png",
    accent: "#e5a35c",
    meters: { acidity: 86, body: 42, sweetness: 70 },
    brew: ["V60 · 1:16 · 94°C", "Chemex · 1:15 · coarse", "AeroPress · 1:13 · 90°C"],
    badge: "New crop",
    rating: 4.9,
    reviews: 132,
  },
  {
    id: "huila-sunset",
    name: "Huila Sunset",
    origin: "Colombia · San Agustín",
    category: "single-origin",
    roast: 3,
    roastLabel: "Medium roast",
    price: 19.0,
    weight: "250 g · whole bean",
    notes: ["Panela", "Red plum", "Cacao nib"],
    description:
      "Pink Bourbon from Finca La Esperanza, honey-processed and taken just far enough into caramel to round the fruit. Syrupy and comforting — panela sweetness up front, a plum-jam middle, and a clean cacao finish.",
    process: "Honey",
    elevation: "1,650 masl",
    varietal: "Pink Bourbon",
    producer: "Finca La Esperanza",
    image: "https://image.qwenlm.ai/generated-images/05c897c6-99e9-441e-b6ef-855eaf1857db/_result.png",
    accent: "#c97a4b",
    meters: { acidity: 62, body: 58, sweetness: 82 },
    brew: ["V60 · 1:15 · 93°C", "Batch brew · 1:16", "Espresso · 1:2 · 27 s"],
    rating: 4.8,
    reviews: 98,
  },
  {
    id: "ember-blend",
    name: "Ember Blend",
    origin: "Brazil & Guatemala",
    category: "blend",
    roast: 4,
    roastLabel: "Medium-dark",
    price: 18.0,
    weight: "250 g · whole bean",
    notes: ["Dark chocolate", "Hazelnut", "Brown sugar"],
    description:
      "Our house espresso, built to cut through milk without shouting. A natural Brazil base gives hazelnut and weight; a washed Antigua lifts it with brown-sugar sparkle. The cup every regular asks for by name.",
    process: "Natural & washed",
    elevation: "1,100–1,600 masl",
    varietal: "Mundo Novo & Caturra",
    producer: "Two-farm seasonal recipe",
    image: "https://image.qwenlm.ai/generated-images/dec1200f-c888-4386-a462-482cfdba7632/_result.png",
    accent: "#d98e3f",
    meters: { acidity: 38, body: 86, sweetness: 74 },
    brew: ["Espresso · 1:2 · 28 s", "Moka pot · fine", "French press · 1:14"],
    badge: "Espresso pick",
    rating: 4.9,
    reviews: 411,
  },
  {
    id: "midnight-foundry",
    name: "Midnight Foundry",
    origin: "Sumatra & Brazil",
    category: "blend",
    roast: 5,
    roastLabel: "Dark roast",
    price: 17.0,
    weight: "250 g · whole bean",
    notes: ["Smoked cedar", "Molasses", "Bittersweet cocoa"],
    description:
      "For the 5 a.m. crowd and the after-dinner crowd alike. Wet-hulled Sumatra brings cedar smoke and heft; a deep-roasted Brazil rounds it into molasses and cocoa. Zero bitterness, all backbone — best with cream or bravado.",
    process: "Wet-hulled",
    elevation: "900–1,200 masl",
    varietal: "Typica & Catuaí",
    producer: "Linton & Cerrado growers",
    image: "https://image.qwenlm.ai/generated-images/c55614b0-25ca-495d-921c-f184c313a6ed/_result.png",
    accent: "#a3652e",
    meters: { acidity: 22, body: 94, sweetness: 48 },
    brew: ["French press · 1:13", "Espresso · 1:1.8", "Cold brew · 1:8 · 16 h"],
    rating: 4.7,
    reviews: 265,
  },
  {
    id: "nyeri-nights",
    name: "Nyeri Nights",
    origin: "Kenya · Nyeri AA",
    category: "single-origin",
    roast: 2,
    roastLabel: "Light roast",
    price: 23.0,
    weight: "250 g · whole bean",
    notes: ["Blackcurrant", "Rhubarb", "Grapefruit"],
    description:
      "A double-fermented AA from Gichathaini Factory with the electric acidity Kenyan lots are hunted for. Blackcurrant juice over crushed ice, a rhubarb snap mid-cup, grapefruit zest on the finish. Loud, juicy, unapologetic.",
    process: "Washed · double fermented",
    elevation: "1,750 masl",
    varietal: "SL28 & SL34",
    producer: "Gichathaini Factory",
    image: "https://image.qwenlm.ai/generated-images/7dfe18c9-d2f2-4a92-9b3e-71f66eb01b2a/_result.png",
    accent: "#7f9a5f",
    meters: { acidity: 90, body: 54, sweetness: 64 },
    brew: ["V60 · 1:17 · 95°C", "Kalita · 1:15", "AeroPress · inverted · 1:13"],
    badge: "Micro-lot · 14 bags",
    rating: 5.0,
    reviews: 57,
  },
  {
    id: "quiet-hours",
    name: "Quiet Hours",
    origin: "Colombia · Cauca",
    category: "decaf",
    roast: 3,
    roastLabel: "Medium roast · decaf",
    price: 18.5,
    weight: "250 g · whole bean",
    notes: ["Milk chocolate", "Marzipan", "Orange zest"],
    description:
      "Sugarcane E.A. decaf that nobody clocks as decaf. A Castillo lot from Cauca that keeps its milk-chocolate heart and a gentle orange-zest top note. Brew it at 10 p.m. and still make your 6 a.m.",
    process: "Sugarcane E.A. decaf",
    elevation: "1,700 masl",
    varietal: "Castillo",
    producer: "Cauca co-operative",
    image: "https://image.qwenlm.ai/generated-images/5a8c1302-bfd2-4fe7-89c3-332053c0de2d/_result.png",
    accent: "#b5a06a",
    meters: { acidity: 48, body: 64, sweetness: 84 },
    brew: ["V60 · 1:15 · 92°C", "Batch brew · 1:16", "Cortado · 1:2"],
    badge: "Sleep-friendly",
    rating: 4.8,
    reviews: 174,
  },
];
