"use client";

import Image from "next/image";
import Link from "next/link";
import { describeSelection, isPurchasable } from "@/lib/catalog";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";
import { cart } from "@/store/stores";
import type { PricedLine } from "@/types/commerce";
import { Icon } from "../ui/Icon";
import { Price } from "../ui/primitives";

export function QuantityStepper({ value, onChange, size = "md" }: { value: number; onChange: (n: number) => void; size?: "sm" | "md" }) {
  const { dict } = useI18n();
  const btn = cn("grid place-items-center transition-colors hover:bg-stone/50 disabled:opacity-30", size === "sm" ? "size-8" : "size-11");
  return (
    <div className="inline-flex items-center border hairline" role="group" aria-label={dict.product.quantity}>
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label={dict.cart.qtyDecrease}>
        <Icon name="minus" size={14} />
      </button>
      <output className={cn("num text-center text-sm", size === "sm" ? "w-7" : "w-10")} aria-live="polite">
        {value}
      </output>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= 99} aria-label={dict.cart.qtyIncrease}>
        <Icon name="plus" size={14} />
      </button>
    </div>
  );
}

export function CartLineItem({ line, variant = "drawer", highlight, saved }: { line: PricedLine; variant?: "drawer" | "page"; highlight?: boolean; saved?: boolean }) {
  const { dict, href, locale, t } = useI18n();
  const selection = describeSelection(line.product, line.selection);
  const link = href(`/products/${line.product.slug}`);
  const available = isPurchasable(line.availability);

  return (
    <li className={cn("relative flex gap-4 py-6 transition-colors duration-1000", highlight && "bg-stone/30", variant === "page" && "md:gap-8")}>
      <Link href={link} className={cn("relative shrink-0 overflow-hidden bg-stone", variant === "page" ? "h-36 w-28 md:h-44 md:w-36" : "h-28 w-22")}>
        <Image src={line.image.src} alt={t(line.image.alt)} fill sizes="150px" className="object-cover" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link href={link} className="block text-[0.95rem] font-medium hover:underline underline-offset-4">
              {t(line.product.name)}
            </Link>
            {selection.length > 0 && (
              <p className="mt-1 text-xs leading-relaxed text-mute">{selection.map((s) => `${t(s.option)}: ${t(s.value)}`).join(" · ")}</p>
            )}
            <p className="num mt-1 text-[10px] tracking-wider text-taupe">{line.sku}</p>
            {!available && <p className="mt-1 text-xs text-danger">{dict.availability[line.availability]}</p>}
          </div>
          <Price amount={saved ? line.unitPrice : line.lineTotal} locale={locale} size="sm" className="shrink-0 text-end" />
        </div>
        {variant === "page" && !saved && line.quantity > 1 && (
          <p className="mt-2 text-xs text-mute">
            {dict.cart.unitPrice}: <Price amount={line.unitPrice} locale={locale} size="sm" />
          </p>
        )}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
          {saved ? (
            <button type="button" onClick={() => cart.moveToCart(line.key)} className="link-line text-xs">{dict.cart.moveToCart}</button>
          ) : (
            <QuantityStepper value={line.quantity} onChange={(n) => cart.setQuantity(line.key, n)} size="sm" />
          )}
          <div className="flex items-center gap-4 text-xs text-mute">
            {!saved && variant === "page" && (
              <button type="button" onClick={() => cart.saveForLater(line.key)} className="hover:text-charcoal underline-offset-4 hover:underline">
                {dict.cart.saveForLater}
              </button>
            )}
            <button
              type="button"
              onClick={() => (saved ? cart.removeSaved(line.key) : cart.remove(line.key))}
              className="flex items-center gap-1 hover:text-charcoal"
              aria-label={`${dict.common.remove} ${t(line.product.name)}`}
            >
              <Icon name="trash" size={15} />
              <span className="hidden sm:inline">{dict.common.remove}</span>
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
