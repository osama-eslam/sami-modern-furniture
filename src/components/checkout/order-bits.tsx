"use client";

import Image from "next/image";
import { governorates } from "@/data/config/shipping";
import { paymentMethods } from "@/data/config/payments";
import type { Dictionary } from "@/i18n/get-dictionary";
import { useI18n } from "@/i18n/provider";
import { formatDate, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types/commerce";
import type { Locale } from "@/types/content";
import { Icon } from "../ui/Icon";

export const FLOW: OrderStatus[] = ["received", "confirmed", "preparing", "ready", "out_for_delivery", "delivered"];

export const governorateName = (id: string, locale: Locale) => governorates.find((g) => g.id === id)?.name[locale] ?? id;
export const paymentName = (id: string, locale: Locale) => paymentMethods.find((m) => m.id === id)?.name[locale] ?? id;

export const formatAddress = (a: Order["address"], locale: Locale) =>
  [a.street, a.building && `${locale === "ar" ? "عمارة" : "Bldg"} ${a.building}`, a.floor && `${locale === "ar" ? "دور" : "Floor"} ${a.floor}`, a.apartment && `${locale === "ar" ? "شقة" : "Apt"} ${a.apartment}`, a.area, a.city, governorateName(a.governorate, locale)]
    .filter(Boolean)
    .join("، ");

/** Plain-text order summary for WhatsApp confirmation. */
export const orderWhatsappText = (order: Order, dict: Dictionary, locale: Locale) =>
  [
    `${dict.success.number}: ${order.number}`,
    `${dict.checkout.fullName}: ${order.customer.fullName}`,
    `${dict.checkout.phone}: ${order.customer.phone}`,
    "",
    ...order.lines.map((l) => `• ${l.name[locale]}${l.selection.length ? ` (${l.selection.map((s) => s.value[locale]).join(" / ")})` : ""} × ${l.quantity} — ${formatPrice(l.lineTotal, locale)} [${l.sku}]`),
    "",
    order.totals.discount > 0 ? `${dict.cart.discount}: −${formatPrice(order.totals.discount, locale)}` : "",
    `${dict.cart.total}: ${formatPrice(order.totals.total, locale)}${order.totals.shipping === null ? ` + ${dict.checkout.shippingFee} (${dict.cart.shippingTbc})` : ""}`,
    `${dict.success.address}: ${formatAddress(order.address, locale)}`,
    `${dict.success.payment}: ${paymentName(order.paymentMethod, locale)}`,
    order.notes ? `${dict.checkout.notes}: ${order.notes}` : "",
  ]
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

export function StatusTimeline({ order }: { order: Order }) {
  const { dict, locale } = useI18n();
  if (order.status === "cancelled") {
    return <p className="inline-flex items-center gap-2 border border-danger/40 px-4 py-2 text-sm text-danger">{dict.status.cancelled}</p>;
  }
  const current = FLOW.indexOf(order.status);
  return (
    <ol className="relative grid gap-0 sm:grid-cols-6">
      {FLOW.map((s, i) => {
        const done = i <= current;
        const at = order.history.find((h) => h.status === s)?.at;
        return (
          <li key={s} className="relative flex gap-4 pb-7 sm:flex-col sm:gap-3 sm:pb-0 sm:pe-3">
            {i < FLOW.length - 1 && (
              <span aria-hidden className={cn("absolute start-[11px] top-6 bottom-0 w-px sm:start-6 sm:end-0 sm:top-[11px] sm:bottom-auto sm:h-px sm:w-auto", i < current ? "bg-charcoal" : "bg-line-strong")} />
            )}
            <span className={cn("relative z-[1] grid size-6 shrink-0 place-items-center rounded-full border", done ? "border-charcoal bg-charcoal text-ivory" : "border-line-strong bg-ivory")}>
              {done && <Icon name="check" size={12} strokeWidth={2} />}
            </span>
            <span>
              <span className={cn("block text-sm", i === current ? "font-medium" : done ? "" : "text-mute")}>{dict.status[s]}</span>
              {at && <span className="num mt-0.5 block text-[11px] text-mute">{formatDate(at, locale, true)}</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function OrderLines({ order }: { order: Order }) {
  const { dict, locale } = useI18n();
  return (
    <div>
      <ul className="divide-y hairline">
        {order.lines.map((l) => (
          <li key={`${l.productId}-${l.sku}`} className="flex gap-4 py-4">
            <div className="relative h-20 w-16 shrink-0 bg-stone">
              <Image src={l.image} alt={l.name[locale]} fill sizes="64px" className="object-cover" />
              <span className="num absolute -end-2 -top-2 grid size-5 place-items-center rounded-full bg-charcoal text-[10px] text-ivory">{l.quantity}</span>
            </div>
            <div className="min-w-0 flex-1 text-sm">
              <p className="font-medium">{l.name[locale]}</p>
              {l.selection.length > 0 && <p className="mt-1 text-xs text-mute">{l.selection.map((s) => `${s.option[locale]}: ${s.value[locale]}`).join(" · ")}</p>}
              <p className="num mt-1 text-[10px] tracking-wider text-taupe">{l.sku}</p>
            </div>
            <p className="num shrink-0 text-sm">{formatPrice(l.lineTotal, locale)}</p>
          </li>
        ))}
      </ul>
      <dl className="space-y-3 border-t hairline pt-5 text-sm">
        <div className="flex justify-between">
          <dt>{dict.cart.subtotal}</dt>
          <dd className="num">{formatPrice(order.totals.subtotal, locale)}</dd>
        </div>
        {order.totals.discount > 0 && (
          <div className="flex justify-between text-success">
            <dt>
              {dict.cart.discount}
              {order.couponCode && <span className="num ms-2 text-xs">({order.couponCode})</span>}
            </dt>
            <dd className="num">−{formatPrice(order.totals.discount, locale)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt>{dict.checkout.shippingFee}</dt>
          <dd className={order.totals.shipping === null ? "text-mute" : "num"}>{order.totals.shipping === null ? dict.cart.shippingTbc : formatPrice(order.totals.shipping, locale)}</dd>
        </div>
        <div className="flex items-baseline justify-between border-t hairline pt-4">
          <dt className="font-medium">{order.totals.shipping === null ? dict.cart.estimatedTotal : dict.cart.total}</dt>
          <dd className="num text-2xl font-light">{formatPrice(order.totals.total, locale)}</dd>
        </div>
      </dl>
    </div>
  );
}
