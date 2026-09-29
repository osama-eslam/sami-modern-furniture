"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useI18n } from "@/i18n/provider";
import { fmt } from "@/i18n/config";
import { categoryBySlug } from "@/data/categories";
import { defaultSelection, discountPercent, isPurchasable } from "@/lib/catalog";
import { whatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { cart, compare, compareStore, toast, ui, wishlist, wishlistStore } from "@/store/stores";
import type { Product } from "@/types/commerce";
import { Icon } from "../ui/Icon";
import { Price } from "../ui/primitives";

export function WishlistButton({ productId, className, label }: { productId: string; className?: string; label?: boolean }) {
  const { dict } = useI18n();
  const { ids } = wishlistStore.use();
  const active = ids.includes(productId);
  const [pulse, setPulse] = useState(0);
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? dict.product.wishlistRemove : dict.product.wishlistAdd}
      onClick={(e) => {
        e.preventDefault();
        wishlist.toggle(productId);
        setPulse((p) => p + 1);
      }}
      className={cn("inline-flex items-center gap-2", className)}
    >
      <Icon key={pulse} name="heart" size={20} className={cn(pulse > 0 && "heart-pop", active && "fill-charcoal")} />
      {label && <span className="text-sm">{active ? dict.product.wishlistRemove : dict.product.wishlistAdd}</span>}
    </button>
  );
}

export function CompareButton({ productId, className }: { productId: string; className?: string }) {
  const { dict } = useI18n();
  const { ids } = compareStore.use();
  const active = ids.includes(productId);
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => {
        if (!compare.toggle(productId)) toast(dict.compare.limit);
      }}
      className={cn("inline-flex items-center gap-2 text-sm", className)}
    >
      <Icon name="compare" size={18} />
      {active ? dict.product.compareRemove : dict.product.compareAdd}
    </button>
  );
}

export function ProductCard({ product, priority, sizes, className, index }: { product: Product; priority?: boolean; sizes?: string; className?: string; index?: number }) {
  const { dict, href, locale, t } = useI18n();
  const url = href(`/products/${product.slug}`);
  const [primary, secondary] = product.images;
  const off = discountPercent(product.price, product.compareAtPrice);
  const purchasable = isPurchasable(product.availability);
  const category = categoryBySlug(product.category);
  const hasOptions = product.options.length > 0;

  return (
    <article className={cn("group relative flex flex-col", className)} data-reveal style={{ "--reveal-delay": `${((index ?? 0) % 4) * 80}ms` } as React.CSSProperties}>
      <div className="img-swap relative aspect-[4/5] overflow-hidden bg-stone">
        <Link href={url} aria-label={t(product.name)} className="absolute inset-0 z-[1]">
          <Image
            src={primary.src}
            alt={t(primary.alt)}
            fill
            priority={priority}
            sizes={sizes ?? "(min-width:1280px) 25vw, (min-width:768px) 33vw, 50vw"}
            className="img-primary object-cover"
          />
          {secondary && <Image src={secondary.src} alt="" fill sizes={sizes ?? "(min-width:1280px) 25vw, (min-width:768px) 33vw, 50vw"} className="img-secondary object-cover" />}
        </Link>

        {/* Badges */}
        <div className="pointer-events-none absolute start-3 top-3 z-[2] flex flex-col items-start gap-1.5">
          {off > 0 && <span className="num bg-charcoal px-2 py-1 text-[10px] font-medium tracking-wider text-ivory">{fmt(dict.product.off, { percent: off })}</span>}
          {product.isNew && <span className="bg-ivory px-2 py-1 text-[10px] font-medium tracking-wider">{dict.product.new}</span>}
          {!purchasable && <span className="bg-ivory/90 px-2 py-1 text-[10px] tracking-wider text-mute">{dict.availability[product.availability]}</span>}
        </div>

        <WishlistButton productId={product.id} className="absolute end-2 top-2 z-[2] grid size-10 place-items-center bg-ivory/0 transition-colors hover:bg-ivory/80" />

        {/* Hover actions (always visible on touch) */}
        <div className="card-actions absolute inset-x-2 bottom-2 z-[2] flex gap-1.5">
          <button
            type="button"
            disabled={!purchasable}
            onClick={() => (hasOptions ? ui.set((u) => ({ ...u, quickViewId: product.id })) : cart.add(product.id, defaultSelection(product)))}
            className="flex h-10 flex-1 items-center justify-center gap-2 bg-ivory/95 text-[11px] font-medium tracking-wider uppercase backdrop-blur transition-colors hover:bg-charcoal hover:text-ivory disabled:opacity-60 rtl:normal-case rtl:text-xs"
          >
            <Icon name="bag" size={16} />
            <span className="hidden xs:inline">{hasOptions ? dict.product.quickView : dict.product.addToCart}</span>
          </button>
          <button
            type="button"
            onClick={() => ui.set((u) => ({ ...u, quickViewId: product.id }))}
            className="hidden size-10 place-items-center bg-ivory/95 backdrop-blur transition-colors hover:bg-charcoal hover:text-ivory md:grid"
            aria-label={dict.product.quickView}
          >
            <Icon name="eye" size={18} />
          </button>
          <a
            href={whatsappLink(`${fmt(dict.whatsappMessages.product, { product: t(product.name) })}\n${product.sku}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="grid size-10 place-items-center bg-ivory/95 backdrop-blur transition-colors hover:bg-[#1f3b2d] hover:text-ivory"
            aria-label={`${dict.product.whatsapp} — ${t(product.name)}`}
          >
            <Icon name="whatsapp" size={18} />
          </a>
        </div>
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <p className="eyebrow text-mute">{category ? t(category.name) : ""}</p>
        <h3 className="mt-1.5 text-[0.95rem] font-medium leading-snug">
          <Link href={url} className="hover:underline underline-offset-4">
            {t(product.name)}
          </Link>
        </h3>
        <div className="mt-2 flex items-center justify-between gap-3">
          <Price amount={product.price} compareAt={product.compareAtPrice} locale={locale} size="sm" />
          {product.colors.length > 1 && (
            <ul className="flex items-center gap-1" aria-label={fmt(dict.product.colors, { count: product.colors.length })}>
              {product.colors.slice(0, 4).map((c) => (
                <li key={c.hex} title={t(c.name)} className="size-2.5 rounded-full ring-1 ring-charcoal/15" style={{ background: c.hex }} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </article>
  );
}
