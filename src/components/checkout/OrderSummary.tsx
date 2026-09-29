"use client";

import Image from "next/image";
import { useI18n } from "@/i18n/provider";
import { fmt } from "@/i18n/config";
import { describeSelection } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import type { PricedLine, ShippingQuote } from "@/types/commerce";

export function OrderSummary({ lines, subtotal, discount, shipping, total }: { lines: PricedLine[]; subtotal: number; discount: number; shipping: ShippingQuote; total: number }) {
  const { dict, locale, t } = useI18n();
  return (
    <div>
      <ul className="divide-y hairline">
        {lines.map((l) => (
          <li key={l.key} className="flex gap-4 py-4">
            <div className="relative h-20 w-16 shrink-0 bg-stone">
              <Image src={l.image.src} alt={t(l.image.alt)} fill sizes="64px" className="object-cover" />
              <span className="num absolute -end-2 -top-2 grid size-5 place-items-center rounded-full bg-charcoal text-[10px] text-ivory">{l.quantity}</span>
            </div>
            <div className="min-w-0 flex-1 text-sm">
              <p className="font-medium">{t(l.product.name)}</p>
              <p className="mt-1 text-xs text-mute">
                {describeSelection(l.product, l.selection)
                  .map((s) => t(s.value))
                  .join(" · ")}
              </p>
            </div>
            <p className="num shrink-0 text-sm">{formatPrice(l.lineTotal, locale)}</p>
          </li>
        ))}
      </ul>
      <dl className="mt-2 space-y-3 border-t hairline pt-5 text-sm">
        <div className="flex justify-between">
          <dt>{dict.cart.subtotal}</dt>
          <dd className="num">{formatPrice(subtotal, locale)}</dd>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-success">
            <dt>{dict.cart.discount}</dt>
            <dd className="num">−{formatPrice(discount, locale)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt>{dict.checkout.shippingFee}</dt>
          <dd className={shipping.fee === null ? "text-mute" : "num"}>{shipping.fee === null ? dict.cart.shippingTbc : formatPrice(shipping.fee, locale)}</dd>
        </div>
        {shipping.estimatedDays && (
          <div className="flex justify-between text-mute">
            <dt>{dict.checkout.estimatedDelivery}</dt>
            <dd>{fmt(dict.checkout.days, shipping.estimatedDays)}</dd>
          </div>
        )}
        <div className="flex items-baseline justify-between border-t hairline pt-4">
          <dt className="font-medium">{shipping.fee === null ? dict.cart.estimatedTotal : dict.cart.total}</dt>
          <dd className="num text-2xl font-light">{formatPrice(total, locale)}</dd>
        </div>
      </dl>
    </div>
  );
}
