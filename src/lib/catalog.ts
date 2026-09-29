/**
 * Catalog domain logic — pure functions, usable on server and client.
 * UI components never filter/sort/price products themselves.
 */
import { productSource } from "@/data/catalog-source";
import { categories } from "@/data/categories";
import type { Availability, Product, ProductVariant, Room, Style } from "@/types/commerce";
import type { Locale } from "@/types/content";

export const allProducts = (): Product[] => productSource;
export const productById = (id: string) => productSource.find((p) => p.id === id);
export const productBySlug = (slug: string) => productSource.find((p) => p.slug === slug);
export const productsByIds = (ids: string[]) => ids.map(productById).filter(Boolean) as Product[];

/* ------------------------------------------------------------------ variants */

export type Selection = Record<string, string>;

export const defaultSelection = (product: Product): Selection => {
  const sel: Selection = {};
  for (const opt of product.options) if (!opt.optional && opt.values[0]) sel[opt.id] = opt.values[0].id;
  return sel;
};

/** Keep only option ids/value ids that exist; fill required gaps with defaults. */
export const normalizeSelection = (product: Product, selection: Selection = {}): Selection => {
  const out: Selection = {};
  for (const opt of product.options) {
    const v = selection[opt.id];
    if (v && opt.values.some((x) => x.id === v)) out[opt.id] = v;
    else if (!opt.optional && opt.values[0]) out[opt.id] = opt.values[0].id;
  }
  return out;
};

const matchVariant = (product: Product, selection: Selection): ProductVariant | undefined =>
  product.variants.find((v) => Object.entries(v.selection).every(([k, val]) => selection[k] === val));

export type ResolvedVariant = {
  variant?: ProductVariant;
  price: number;
  compareAtPrice?: number;
  sku: string;
  availability: Availability;
  imageIndex: number;
  selection: Selection;
};

export const resolveVariant = (product: Product, rawSelection: Selection = {}): ResolvedVariant => {
  const selection = normalizeSelection(product, rawSelection);
  const variant = matchVariant(product, selection);

  let delta = 0;
  let imageIndex = 0;
  let availability: Availability = product.availability;
  const skuParts: string[] = [];

  for (const opt of product.options) {
    const value = opt.values.find((v) => v.id === selection[opt.id]);
    if (!value) continue;
    delta += value.priceDelta ?? 0;
    if (value.imageIndex !== undefined) imageIndex = value.imageIndex;
    if (value.availability) availability = value.availability;
    skuParts.push(value.id.toUpperCase());
  }

  const price = variant?.price ?? product.price + delta;
  const compareAtPrice =
    variant?.compareAtPrice ?? (product.compareAtPrice ? product.compareAtPrice + delta : undefined);

  return {
    variant,
    price,
    compareAtPrice: compareAtPrice && compareAtPrice > price ? compareAtPrice : undefined,
    sku: variant?.sku ?? [product.sku, ...skuParts].join("-"),
    availability: variant?.availability ?? availability,
    imageIndex: variant?.imageIndex ?? imageIndex,
    selection,
  };
};

export const isPurchasable = (a: Availability) => a === "in_stock" || a === "made_to_order" || a === "pre_order";

export const discountPercent = (price: number, compareAt?: number) =>
  compareAt && compareAt > price ? Math.round(((compareAt - price) / compareAt) * 100) : 0;

/** Human-readable option labels for a selection. */
export const describeSelection = (product: Product, selection: Selection) =>
  product.options
    .filter((o) => selection[o.id])
    .map((o) => ({ option: o.name, value: o.values.find((v) => v.id === selection[o.id])!.label }))
    .filter((x) => x.value);

/* ------------------------------------------------------------------- queries */

export type SortKey = "featured" | "newest" | "price-asc" | "price-desc" | "popular";
export type Collection = "all" | "new" | "best" | "offers";

export type ShopQuery = {
  collection?: Collection;
  category?: string[];
  colors?: string[];
  materials?: string[];
  rooms?: Room[];
  styles?: Style[];
  availability?: Availability[];
  min?: number;
  max?: number;
  sort?: SortKey;
  q?: string;
};

const colorKey = (hex: string) => hex.toLowerCase();

export const filterProducts = (products: Product[], query: ShopQuery, locale: Locale): Product[] => {
  const q = query.q ? normalizeText(query.q) : "";
  let list = products.filter((p) => {
    if (query.collection === "new" && !p.isNew) return false;
    if (query.collection === "best" && !p.isBestSeller) return false;
    if (query.collection === "offers" && !(p.compareAtPrice && p.compareAtPrice > p.price)) return false;
    if (query.category?.length && !query.category.includes(p.category)) return false;
    if (query.colors?.length && !p.colors.some((c) => query.colors!.includes(colorKey(c.hex)))) return false;
    if (query.materials?.length && !p.materials.some((m) => query.materials!.includes(m.en))) return false;
    if (query.rooms?.length && !p.rooms.some((r) => query.rooms!.includes(r))) return false;
    if (query.styles?.length && !query.styles.includes(p.style)) return false;
    if (query.availability?.length && !query.availability.includes(p.availability)) return false;
    if (query.min !== undefined && p.price < query.min) return false;
    if (query.max !== undefined && p.price > query.max) return false;
    if (q && scoreProduct(p, q, locale) === 0) return false;
    return true;
  });

  const sort = query.sort ?? "featured";
  list = [...list].sort((a, b) => {
    switch (sort) {
      case "newest":
        return b.createdAt.localeCompare(a.createdAt);
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "popular":
        return b.popularity - a.popularity;
      default:
        return Number(!!b.isFeatured) - Number(!!a.isFeatured) || b.popularity - a.popularity;
    }
  });
  return list;
};

/** Facet values derived from the catalog so filters always match real data. */
export const facets = (products: Product[]) => {
  const colors = new Map<string, Product["colors"][number]>();
  const materials = new Map<string, Product["materials"][number]>();
  const rooms = new Set<Room>();
  const styles = new Set<Style>();
  const availability = new Set<Availability>();
  let min = Infinity;
  let max = 0;
  for (const p of products) {
    p.colors.forEach((c) => colors.set(colorKey(c.hex), c));
    p.materials.forEach((m) => materials.set(m.en, m));
    p.rooms.forEach((r) => rooms.add(r));
    styles.add(p.style);
    availability.add(p.availability);
    min = Math.min(min, p.price);
    max = Math.max(max, p.price);
  }
  return {
    colors: [...colors.entries()].map(([key, c]) => ({ key, ...c })),
    materials: [...materials.entries()].map(([key, name]) => ({ key, name })),
    rooms: [...rooms],
    styles: [...styles],
    availability: [...availability],
    priceRange: { min: min === Infinity ? 0 : min, max },
  };
};

export const newArrivals = (limit = 8) => filterProducts(allProducts(), { collection: "new", sort: "newest" }, "en").slice(0, limit);
export const bestSellers = (limit = 8) => filterProducts(allProducts(), { collection: "best", sort: "popular" }, "en").slice(0, limit);
export const featuredProducts = (limit = 8) => allProducts().filter((p) => p.isFeatured).slice(0, limit);

export const similarProducts = (product: Product, limit = 8) =>
  allProducts()
    .filter((p) => p.id !== product.id && (p.category === product.category || p.rooms.some((r) => product.rooms.includes(r))))
    .sort((a, b) => Number(b.category === product.category) - Number(a.category === product.category) || b.popularity - a.popularity)
    .slice(0, limit);

export const youMayLike = (product: Product, limit = 8) =>
  allProducts()
    .filter((p) => p.id !== product.id && p.category !== product.category && p.style === product.style)
    .concat(allProducts().filter((p) => p.id !== product.id && p.isBestSeller))
    .filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i)
    .slice(0, limit);

export const completeTheLook = (product: Product) => productsByIds(product.completeTheLook ?? []);

export const categoryCounts = () => {
  const counts: Record<string, number> = {};
  for (const p of allProducts()) counts[p.category] = (counts[p.category] ?? 0) + 1;
  return counts;
};

export const sortedCategories = () => [...categories].sort((a, b) => a.order - b.order);

/* -------------------------------------------------------------------- search */

/** Normalise Arabic & Latin text for matching (diacritics, alef/ya/ta-marbuta forms, case). */
export const normalizeText = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[ً-ٰٟـ]/g, "") // tashkeel + tatweel
    .replace(/[̀-ͯ]/g, "") // latin diacritics
    .replace(/[إأآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

export const scoreProduct = (p: Product, nq: string, locale: Locale) => {
  if (!nq) return 0;
  const cat = categories.find((c) => c.slug === p.category);
  const fields: [string, number][] = [
    [p.name.ar, 5],
    [p.name.en, 5],
    [p.collection?.ar ?? "", 3],
    [p.collection?.en ?? "", 3],
    [cat?.name.ar ?? "", 3],
    [cat?.name.en ?? "", 3],
    [p.keywords.join(" "), 2],
    [p.shortDescription[locale], 1],
    [p.materials.map((m) => `${m.ar} ${m.en}`).join(" "), 1],
    [p.sku, 2],
  ];
  const tokens = nq.split(" ").filter(Boolean);
  let score = 0;
  for (const token of tokens) {
    let hit = 0;
    for (const [field, weight] of fields) {
      const nf = normalizeText(field);
      if (nf.startsWith(token) || nf.includes(` ${token}`)) hit = Math.max(hit, weight * 2);
      else if (nf.includes(token)) hit = Math.max(hit, weight);
    }
    if (!hit) return 0; // every token must match somewhere
    score += hit;
  }
  return score;
};

export const searchProducts = (q: string, locale: Locale, limit = 24) => {
  const nq = normalizeText(q);
  if (!nq) return [];
  return allProducts()
    .map((p) => ({ p, s: scoreProduct(p, nq, locale) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((x) => x.p);
};

export const searchCategories = (q: string) => {
  const nq = normalizeText(q);
  if (!nq) return [];
  return categories.filter((c) => normalizeText(`${c.name.ar} ${c.name.en} ${c.slug}`).includes(nq));
};
