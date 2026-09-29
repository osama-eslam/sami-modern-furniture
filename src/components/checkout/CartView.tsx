"use client";

import Link from "next/link";
import { useState } from "react";
import { useI18n } from "@/i18n/provider";
import { fmt } from "@/i18n/config";
import { formatPrice } from "@/lib/format";
import { applyCoupon } from "@/lib/pricing";
import { whatsappLink } from "@/lib/whatsapp";
import { useHydrated } from "@/store/create-store";
import { cart } from "@/store/stores";
import { RecentlyViewed } from "../product/RecentlyViewed";
import { Icon } from "../ui/Icon";
import { CartLineItem } from "./CartLineItem";
import { useCart } from "./useCart";

export function CouponForm() {
  const { dict } = useI18n();
  const { lines, coupon, totals } = useCart();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (coupon && totals.couponResult?.ok) {
    return (
      <div className="flex items-center justify-between border hairline bg-paper px-4 py-3 text-sm">
        <span className="flex items-center gap-2 text-success">
          <Icon name="check" size={16} /> {fmt(dict.cart.couponApplied, { code: coupon })}
        </span>
        <button type="button" onClick={() => cart.setCoupon(undefined)} className="text-xs text-mute underline">
          {dict.cart.removeCoupon}
        </button>
      </div>
    );
  }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const r = applyCoupon(code, lines);
        if (r.ok) {
          cart.setCoupon(r.coupon.code);
          setError(null);
          setCode("");
        } else setError(dict.cart.couponErrors[r.reason]);
      }}
    >
      <label htmlFor="coupon" className="field-label">{dict.cart.coupon}</label>
      <div className="mt-2 flex">
        <input id="coupon" value={code} onChange={(e) => setCode(e.target.value)} className="input input-box !min-h-12 flex-1 uppercase" autoComplete="off" aria-invalid={!!error} aria-describedby="coupon-err" dir="ltr" />
        <button type="submit" className="btn btn-outline !min-h-12 -ms-px" disabled={!code.trim()}>
          {dict.cart.applyCoupon}
        </button>
      </div>
      <p id="coupon-err" role="alert" className="field-error mt-2 min-h-5">{error}</p>
    </form>
  );
}

export function CartView() {
  const { dict, href, locale } = useI18n();
  const hydrated = useHydrated();
  const { lines, saved, totals, count } = useCart();

  if (!hydrated) return <div className="container-x min-h-[50vh]" />;

  if (!lines.length && !saved.length) {
    return (
      <>
        <div className="container-x flex min-h-[40vh] flex-col items-start justify-center gap-6 border-t hairline py-20">
          <p className="font-display text-h2">{dict.cart.empty}</p>
          <p className="lead">{dict.cart.emptyBody}</p>
          <Link href={href("/shop")} className="btn btn-primary">
            {dict.cart.continue} <Icon name="arrow" size={16} className="flip-rtl" />
          </Link>
        </div>
        <RecentlyViewed className="section" />
      </>
    );
  }

  return (
    <div className="container-x grid gap-14 pb-28 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-8">
        <div className="flex items-baseline justify-between border-b border-charcoal pb-4">
          <p className="num text-sm text-mute">{fmt(count === 1 ? dict.common.item : dict.common.items, { count })}</p>
          <Link href={href("/shop")} className="link-line text-sm">
            {dict.cart.continue}
          </Link>
        </div>
        {lines.length > 0 ? (
          <ul className="divide-y hairline">
            {lines.map((l) => (
              <CartLineItem key={l.key} line={l} variant="page" />
            ))}
          </ul>
        ) : (
          <p className="py-10 text-mute">{dict.cart.empty}</p>
        )}

        {saved.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display border-b border-charcoal pb-4 text-h3">{dict.cart.savedForLater}</h2>
            <ul className="divide-y hairline">
              {saved.map((l) => (
                <CartLineItem key={l.key} line={l} variant="page" saved />
              ))}
            </ul>
          </div>
        )}
      </div>

      <aside className="lg:col-span-4" aria-label={dict.checkout.summary}>
        <div className="sticky top-[calc(var(--header-h)+2rem)] bg-paper p-6 md:p-8">
          <h2 className="font-display text-h3">{dict.checkout.summary}</h2>
          <div className="mt-6">
            <CouponForm />
          </div>
          <dl className="mt-4 space-y-3 border-t hairline pt-6 text-sm">
            <div className="flex justify-between">
              <dt>{dict.cart.subtotal}</dt>
              <dd className="num">{formatPrice(totals.subtotal, locale)}</dd>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between text-success">
                <dt>{dict.cart.discount}</dt>
                <dd className="num">−{formatPrice(totals.discount, locale)}</dd>
              </div>
            )}
            <div className="flex justify-between text-mute">
              <dt>{dict.cart.shipping}</dt>
              <dd>{dict.cart.shippingTbc}</dd>
            </div>
            <div className="flex items-baseline justify-between border-t hairline pt-4 text-base">
              <dt className="font-medium">{dict.cart.estimatedTotal}</dt>
              <dd className="num text-2xl font-light">{formatPrice(totals.total, locale)}</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs leading-relaxed text-mute">{dict.cart.shippingNote}</p>
          <Link href={href("/checkout")} aria-disabled={!lines.length} className={`btn btn-primary btn-block mt-6 ${!lines.length ? "pointer-events-none opacity-40" : ""}`}>
            {dict.cart.checkout} <Icon name="arrow" size={16} className="flip-rtl" />
          </Link>
          <a href={whatsappLink(dict.whatsappMessages.general)} target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center justify-center gap-2 text-sm text-mute hover:text-charcoal">
            <Icon name="whatsapp" size={16} /> {dict.common.chatWhatsapp}
          </a>
        </div>
      </aside>
    </div>
  );
}
