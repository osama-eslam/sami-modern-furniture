export type Locale = "ar" | "en";

/** A localized string. Every customer-facing text in data files uses this. */
export type L10n = { ar: string; en: string };

export type ImageAsset = {
  src: string;
  alt: L10n;
  width?: number;
  height?: number;
  /** true when the image is illustrative stock and NOT a real Samy Modern product/space */
  illustrative?: boolean;
};

export type Article = {
  slug: string;
  topic: "living" | "bedroom" | "dining" | "small-spaces" | "color" | "combinations" | "interior";
  title: L10n;
  excerpt: L10n;
  hero: ImageAsset;
  readingMinutes: number;
  publishedAt: string;
  body: { heading?: L10n; text: L10n; image?: ImageAsset }[];
  relatedCategories: string[];
  relatedProducts: string[];
};

export type GalleryCategory =
  | "bedrooms"
  | "living"
  | "dining"
  | "sofas"
  | "showroom"
  | "details";

export type GalleryItem = {
  id: string;
  category: GalleryCategory;
  image: ImageAsset;
  caption: L10n;
  ratio: "portrait" | "landscape" | "square";
};

export type FaqItem = { q: L10n; a: L10n };
export type FaqGroup = { id: string; title: L10n; items: FaqItem[] };

export type PolicyDoc = {
  slug: string;
  title: L10n;
  intro: L10n;
  sections: { heading: L10n; body: L10n; pending?: boolean }[];
  updatedAt: string | null;
};
