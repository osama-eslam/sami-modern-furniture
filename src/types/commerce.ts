import type { ImageAsset, L10n } from "./content";

/* ------------------------------------------------------------------ Catalog */

export type Availability =
  | "in_stock"
  | "made_to_order"
  | "pre_order"
  | "coming_soon"
  | "out_of_stock";

export type Category = {
  slug: string;
  name: L10n;
  tagline: L10n;
  image: ImageAsset;
  /** shown in the quick-category strip on the homepage */
  featured?: boolean;
  order: number;
};

export type Room = "living" | "bedroom" | "dining" | "office" | "kitchen" | "entrance";
export type Style = "modern" | "contemporary" | "minimal" | "classic-modern" | "scandinavian";

export type OptionKind = "color" | "fabric" | "finish" | "size" | "configuration" | "orientation" | "material" | "addon";

export type OptionValue = {
  id: string;
  label: L10n;
  /** swatch colour for color/fabric/finish options */
  hex?: string;
  /** price added on top of the base price when no explicit variant price exists */
  priceDelta?: number;
  /** index into product.images to show when this value is selected */
  imageIndex?: number;
  /** marks a value as unavailable without needing a full variant entry */
  availability?: Availability;
};

export type ProductOption = {
  id: string;
  kind: OptionKind;
  name: L10n;
  values: OptionValue[];
  /** optional add-ons can be left unselected */
  optional?: boolean;
};

export type ProductVariant = {
  id: string;
  sku: string;
  /** optionId → valueId */
  selection: Record<string, string>;
  price?: number;
  compareAtPrice?: number;
  availability?: Availability;
  /** index into product.images to show when this variant is selected */
  imageIndex?: number;
};

export type Dimensions = { width: number; depth: number; height: number; unit: "cm" };

export type Product = {
  id: string;
  slug: string;
  sku: string;
  name: L10n;
  collection?: L10n;
  category: string;
  rooms: Room[];
  style: Style;
  shortDescription: L10n;
  description: L10n;
  images: ImageAsset[];
  video?: { src: string; poster: string };
  /** future: 360° spin frames */
  spin360?: string[];
  price: number;
  compareAtPrice?: number;
  currency: "EGP";
  availability: Availability;
  /** internal only — never rendered */
  stockQuantity?: number;
  options: ProductOption[];
  variants: ProductVariant[];
  materials: L10n[];
  colors: { name: L10n; hex: string }[];
  dimensions?: Dimensions;
  care?: L10n;
  features: L10n[];
  tags: string[];
  keywords: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  popularity: number;
  createdAt: string;
  completeTheLook?: string[];
  /** true for preview catalog entries */
  demo: boolean;
};

/* --------------------------------------------------------------------- Cart */

export type CartLine = {
  key: string;
  productId: string;
  variantId?: string;
  selection: Record<string, string>;
  quantity: number;
  addedAt: number;
};

export type PricedLine = CartLine & {
  product: Product;
  variant?: ProductVariant;
  unitPrice: number;
  compareAtPrice?: number;
  lineTotal: number;
  sku: string;
  availability: Availability;
  image: ImageAsset;
};

/* ------------------------------------------------------------------ Coupons */

export type Coupon = {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minSubtotal?: number;
  appliesTo?: { categories?: string[]; productIds?: string[] };
  expiresAt?: string;
  active: boolean;
  demo?: boolean;
};

export type CouponResult =
  | { ok: true; coupon: Coupon; discount: number }
  | { ok: false; reason: "not_found" | "expired" | "min_subtotal" | "not_applicable" | "inactive" };

/* ----------------------------------------------------------------- Shipping */

export type Governorate = {
  id: string;
  name: L10n;
  /** null = fee is confirmed by the team after the order */
  fee: number | null;
  /** null = not published */
  estimatedDays: { min: number; max: number } | null;
  enabled: boolean;
  cities?: { id: string; name: L10n; fee?: number | null }[];
};

export type DeliveryMethod = {
  id: "home_delivery" | "showroom_pickup";
  name: L10n;
  description: L10n;
  enabled: boolean;
};

export type ShippingQuote = {
  fee: number | null;
  freeShippingApplied: boolean;
  estimatedDays: { min: number; max: number } | null;
};

/* ----------------------------------------------------------------- Payments */

export type PaymentMethodId = "cash_on_delivery" | "card" | "bank_transfer" | "whatsapp_confirmation";

export type PaymentMethodConfig = {
  id: PaymentMethodId;
  name: L10n;
  description: L10n;
  /** enabled in config AND provider configured on the server */
  enabled: boolean;
  provider: "none" | "paymob" | "manual";
};

/* ------------------------------------------------------------------- Orders */

export type OrderStatus =
  | "received"
  | "confirmed"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type Address = {
  id: string;
  label?: string;
  fullName: string;
  phone: string;
  governorate: string;
  city: string;
  area: string;
  street: string;
  building: string;
  floor?: string;
  apartment?: string;
  instructions?: string;
  isDefault?: boolean;
};

export type Customer = {
  fullName: string;
  phone: string;
  email?: string;
};

export type OrderLine = {
  productId: string;
  variantId?: string;
  sku: string;
  name: L10n;
  selection: { option: L10n; value: L10n }[];
  image: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type OrderTotals = {
  subtotal: number;
  discount: number;
  shipping: number | null;
  total: number;
  currency: "EGP";
};

export type Order = {
  number: string;
  createdAt: string;
  status: OrderStatus;
  history: { status: OrderStatus; at: string }[];
  customer: Customer;
  address: Omit<Address, "id" | "isDefault" | "label">;
  deliveryMethod: DeliveryMethod["id"];
  paymentMethod: PaymentMethodId;
  couponCode?: string;
  notes?: string;
  lines: OrderLine[];
  totals: OrderTotals;
  /** where the order was persisted. "preview" = nothing was sent to the business */
  channel: "backend" | "preview";
  demo: boolean;
};

export type OrderDraft = {
  customer: Customer;
  address: Order["address"];
  deliveryMethod: DeliveryMethod["id"];
  paymentMethod: PaymentMethodId;
  couponCode?: string;
  notes?: string;
  lines: { productId: string; variantId?: string; selection: Record<string, string>; quantity: number }[];
};
