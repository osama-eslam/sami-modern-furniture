"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/provider";
import { fmt } from "@/i18n/config";
import { formatPrice } from "@/lib/format";
import { ui } from "@/store/stores";
import { CartLineItem } from "../checkout/CartLineItem";
import { useCart } from "../checkout/useCart";
import { Icon } from "../ui/Icon";
import { useDialog } from "./useDialog";

export function MiniCart() {
  const { dict, href, locale } = useI18n();
  const { cartOpen, lastAdded } = ui.use();
  const { lines, totals, count } = useCart();
  const close = () => ui.set((u) => ({ ...u, cartOpen: false, lastAdded: null }));
  const ref = useDialog<HTMLDivElement>(cartOpen, close);
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    if (!lastAdded || !cartOpen) return;
    const show = setTimeout(() => setFlash(lastAdded), 0);
    const hide = setTimeout(() => setFlash(null), 1800);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [lastAdded, cartOpen]);

  return (
    <>
      <div className="overlay-backdrop" data-open={cartOpen} onClick={close} aria-hidden />
      <div ref={ref} role="dialog" aria-modal="true" aria-label={dict.cart.title} className="drawer" data-open={cartOpen}>
        <div className="flex h-[var(--header-h)] shrink-0 items-center justify-between border-b hairline px-6">
          <p className="flex items-baseline gap-3">
            <span className="font-display text-2xl">{dict.cart.title}</span>
            <span className="num text-xs text-mute">({count})</span>
          </p>
          <button type="button" onClick={close} className="grid size-10 place-items-center -me-2" aria-label={dict.nav.close}>
            <Icon name="close" size={22} />
          </button>
        </div>

        <div className={`grid overflow-hidden bg-charcoal text-ivory transition-[grid-template-rows] duration-700 ${flash ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`} aria-live="polite">
          <p className="flex items-center gap-2 overflow-hidden px-6 text-sm">
            <span className="py-3 flex items-center gap-2">
              <Icon name="check" size={16} /> {flash ? dict.cart.addedTitle : ""}
            </span>
          </p>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
            <Icon name="bag" size={40} className="text-taupe" />
            <div>
              <p className="font-display text-2xl">{dict.cart.empty}</p>
              <p className="mt-2 text-sm text-mute">{dict.cart.emptyBody}</p>
            </div>
            <Link href={href("/shop")} onClick={close} className="btn btn-primary">{dict.cart.continue}</Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y hairline overflow-y-auto px-6">
              {lines.map((l) => (
                <CartLineItem key={l.key} line={l} highlight={flash === l.key} />
              ))}
            </ul>
            <div className="shrink-0 border-t hairline px-6 pt-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
              <dl className="space-y-2 text-sm">
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
              </dl>
              <p className="mt-2 text-xs text-mute">{fmt(count === 1 ? dict.common.item : dict.common.items, { count })}</p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <Link href={href("/cart")} onClick={close} className="btn btn-outline">{dict.cart.viewCart}</Link>
                <Link href={href("/checkout")} onClick={close} className="btn btn-primary">{dict.cart.checkout}</Link>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
