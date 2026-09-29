/**
 * Pricing, coupons and shipping quotes — pure functions shared by the cart UI
 * (for display) and the orders API (authoritative recomputation).
 */
import { coupons } from "@/data/config/coupons";
import { governorates, shippingSettings } from "@/data/config/shipping";
import { siteConfig } from "@/config/site";
import type { CartLine, Coupon, CouponResult, PricedLine, ShippingQuote } from "@/types/commerce";
import { productById, resolveVariant } from "./catalog";

export const priceLine = (line: CartLine): PricedLine | null => {
  const product = productById(line.productId);
  if (!product) return null;
  const r = resolveVariant(product, line.selection);
  const quantity = Math.max(1, Math.min(99, Math.floor(line.quantity)));
  return {
    ...line,
    quantity,
    product,
    variant: r.variant,
    unitPrice: r.price,
    compareAtPrice: r.compareAtPrice,
    lineTotal: r.price * quantity,
    sku: r.sku,
    availability: r.availability,
    image: product.images[r.imageIndex] ?? product.images[0],
  };
};

export const priceLines = (lines: CartLine[]) => lines.map(priceLine).filter(Boolean) as PricedLine[];

export const subtotalOf = (lines: PricedLine[]) => lines.reduce((sum, l) => sum + l.lineTotal, 0);

export const findCoupon = (code: string): Coupon | undefined =>
  coupons.find((c) => c.code.toLowerCase() === code.trim().toLowerCase() && (!c.demo || siteConfig.demoCatalog));

export const applyCoupon = (code: string, lines: PricedLine[], now = new Date()): CouponResult => {
  const coupon = findCoupon(code);
  if (!coupon) return { ok: false, reason: "not_found" };
  if (!coupon.active) return { ok: false, reason: "inactive" };
  if (coupon.expiresAt && new Date(coupon.expiresAt) < now) return { ok: false, reason: "expired" };

  const eligible = lines.filter((l) => {
    const scope = coupon.appliesTo;
    if (!scope) return true;
    return (scope.categories?.includes(l.product.category) ?? false) || (scope.productIds?.includes(l.product.id) ?? false);
  });
  if (!eligible.length) return { ok: false, reason: "not_applicable" };

  const base = subtotalOf(eligible);
  if (coupon.minSubtotal && subtotalOf(lines) < coupon.minSubtotal) return { ok: false, reason: "min_subtotal" };

  const raw = coupon.type === "percentage" ? (base * coupon.value) / 100 : coupon.value;
  return { ok: true, coupon, discount: Math.min(Math.round(raw), base) };
};

export const quoteShipping = (governorateId: string | undefined, subtotalAfterDiscount: number): ShippingQuote => {
  const gov = governorates.find((g) => g.id === governorateId);
  const threshold = shippingSettings.freeShippingThreshold;
  if (threshold !== null && subtotalAfterDiscount >= threshold) {
    return { fee: 0, freeShippingApplied: true, estimatedDays: gov?.estimatedDays ?? null };
  }
  return { fee: gov?.fee ?? null, freeShippingApplied: false, estimatedDays: gov?.estimatedDays ?? null };
};

export const computeTotals = (lines: PricedLine[], couponCode?: string, governorateId?: string) => {
  const subtotal = subtotalOf(lines);
  const couponResult = couponCode ? applyCoupon(couponCode, lines) : null;
  const discount = couponResult?.ok ? couponResult.discount : 0;
  const shipping = quoteShipping(governorateId, subtotal - discount);
  return {
    subtotal,
    discount,
    couponResult,
    shipping,
    total: subtotal - discount + (shipping.fee ?? 0),
  };
};
