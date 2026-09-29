import "server-only";
/**
 * ORDER CREATION (server only)
 * Prices, coupons, availability and shipping are recomputed here from the
 * catalog — nothing monetary is trusted from the browser.
 *
 * Persistence: if ORDER_WEBHOOK_URL is set, the order is POSTed there
 * (e.g. an admin backend, Zapier/Make, a Google Apps Script, a CRM). Without
 * it, the order is returned with channel "preview" and the UI tells the
 * customer to confirm it with the team on WhatsApp.
 */
import { z } from "zod";
import { siteConfig } from "@/config/site";
import { deliveryMethods, governorates } from "@/data/config/shipping";
import { describeSelection, isPurchasable } from "@/lib/catalog";
import { computeTotals, priceLines } from "@/lib/pricing";
import { isValidEgPhone, normalizePhone } from "@/lib/utils";
import type { Order, OrderDraft } from "@/types/commerce";
import { availablePaymentMethods, providerFor, type PaymentInitiation } from "./payments/registry";

const text = (max: number) => z.string().trim().max(max);
const required = (max: number) => text(max).min(1);

export const orderDraftSchema = z.object({
  customer: z.object({
    fullName: required(120),
    phone: required(20).refine(isValidEgPhone, "invalid_phone"),
    email: z.union([z.literal(""), z.email().max(160)]).optional(),
  }),
  address: z.object({
    fullName: required(120),
    phone: required(20).refine(isValidEgPhone, "invalid_phone"),
    governorate: required(40),
    city: required(80),
    area: required(80),
    street: required(160),
    building: required(40),
    floor: text(20).optional(),
    apartment: text(20).optional(),
    instructions: text(500).optional(),
  }),
  deliveryMethod: z.enum(["home_delivery", "showroom_pickup"]),
  paymentMethod: z.enum(["cash_on_delivery", "card", "bank_transfer", "whatsapp_confirmation"]),
  couponCode: text(40).optional(),
  notes: text(1000).optional(),
  lines: z
    .array(
      z.object({
        productId: required(80),
        variantId: text(80).optional(),
        selection: z.record(z.string().max(40), z.string().max(40)),
        quantity: z.number().int().min(1).max(99),
      }),
    )
    .min(1)
    .max(50),
});

export class OrderError extends Error {
  constructor(public code: string, public status = 400) {
    super(code);
  }
}

const orderNumber = () => {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Array.from(crypto.getRandomValues(new Uint8Array(3)))
    .map((b) => b.toString(36).padStart(2, "0"))
    .join("")
    .slice(0, 5)
    .toUpperCase();
  return `SM-${ymd}-${rand}`;
};

export async function createOrder(input: unknown): Promise<{ order: Order; payment: PaymentInitiation }> {
  const parsed = orderDraftSchema.safeParse(input);
  if (!parsed.success) throw new OrderError("invalid_input");
  const draft = parsed.data as OrderDraft;

  if (!deliveryMethods.some((m) => m.id === draft.deliveryMethod && m.enabled)) throw new OrderError("delivery_unavailable");
  if (!governorates.some((g) => g.id === draft.address.governorate && g.enabled)) throw new OrderError("governorate_unavailable");
  if (!availablePaymentMethods().some((m) => m.id === draft.paymentMethod)) throw new OrderError("payment_unavailable");

  const priced = priceLines(
    draft.lines.map((l, i) => ({ key: String(i), productId: l.productId, selection: l.selection, quantity: l.quantity, addedAt: 0 })),
  );
  if (priced.length !== draft.lines.length) throw new OrderError("product_not_found");
  if (priced.some((l) => !isPurchasable(l.availability))) throw new OrderError("product_unavailable");

  const totals = computeTotals(priced, draft.couponCode, draft.address.governorate);
  if (draft.couponCode && !totals.couponResult?.ok) throw new OrderError("coupon_invalid");

  const now = new Date().toISOString();
  const order: Order = {
    number: orderNumber(),
    createdAt: now,
    status: "received",
    history: [{ status: "received", at: now }],
    customer: { ...draft.customer, phone: normalizePhone(draft.customer.phone), email: draft.customer.email || undefined },
    address: { ...draft.address, phone: normalizePhone(draft.address.phone) },
    deliveryMethod: draft.deliveryMethod,
    paymentMethod: draft.paymentMethod,
    couponCode: totals.couponResult?.ok ? totals.couponResult.coupon.code : undefined,
    notes: draft.notes,
    lines: priced.map((l) => ({
      productId: l.product.id,
      variantId: l.variant?.id,
      sku: l.sku,
      name: l.product.name,
      selection: describeSelection(l.product, l.selection),
      image: l.image.src,
      quantity: l.quantity,
      unitPrice: l.unitPrice,
      lineTotal: l.lineTotal,
    })),
    totals: {
      subtotal: totals.subtotal,
      discount: totals.discount,
      shipping: totals.shipping.fee,
      total: totals.total,
      currency: "EGP",
    },
    channel: "preview",
    demo: siteConfig.demoCatalog,
  };

  const webhook = process.env.ORDER_WEBHOOK_URL;
  if (webhook) {
    const res = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.ORDER_WEBHOOK_SECRET ? { "X-Webhook-Secret": process.env.ORDER_WEBHOOK_SECRET } : {}),
      },
      body: JSON.stringify({ type: "order.created", order: { ...order, channel: "backend" } }),
      signal: AbortSignal.timeout(10_000),
    }).catch(() => null);
    if (!res?.ok) throw new OrderError("persistence_failed", 502);
    order.channel = "backend";
  }

  const provider = providerFor(order.paymentMethod);
  const payment = provider ? await provider.initiate(order) : ({ kind: "none" } as const);
  return { order, payment };
}
