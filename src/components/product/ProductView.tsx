"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { siteConfig } from "@/config/site";
import { useI18n } from "@/i18n/provider";
import { fmt } from "@/i18n/config";
import { describeSelection, isPurchasable, resolveVariant, type Selection } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { absoluteUrl } from "@/lib/seo";
import { whatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { cart, recent, toast } from "@/store/stores";
import type { Availability, Product } from "@/types/commerce";
import { QuantityStepper } from "../checkout/CartLineItem";
import { Icon } from "../ui/Icon";
import { Accordion, Price } from "../ui/primitives";
import { ProductGallery } from "./ProductGallery";
import { CompareButton, WishlistButton } from "./ProductCard";

const availabilityTone: Record<Availability, string> = {
  in_stock: "bg-success",
  made_to_order: "bg-bronze",
  pre_order: "bg-bronze",
  coming_soon: "bg-taupe",
  out_of_stock: "bg-danger",
};

export function AvailabilityLabel({ value }: { value: Availability }) {
  const { dict } = useI18n();
  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <span className={cn("size-1.5 rounded-full", availabilityTone[value])} aria-hidden />
      {dict.availability[value]}
    </span>
  );
}

/** Option picker. Swatches for colour-like options, pills for the rest. */
export function VariantSelector({ product, selection, onChange }: { product: Product; selection: Selection; onChange: (s: Selection) => void }) {
  const { dict, t, locale } = useI18n();
  return (
    <div className="flex flex-col gap-7">
      {product.options.map((opt) => {
        const current = opt.values.find((v) => v.id === selection[opt.id]);
        const swatch = opt.values.every((v) => v.hex);
        if (opt.optional) {
          return (
            <fieldset key={opt.id}>
              <legend className="field-label mb-3">{t(opt.name)}</legend>
              <div className="flex flex-col gap-2">
                {opt.values.map((v) => {
                  const checked = selection[opt.id] === v.id;
                  return (
                    <label key={v.id} className="choice items-center !py-3">
                      <input
                        type="checkbox"
                        className="size-4 accent-charcoal"
                        checked={checked}
                        onChange={() => {
                          const next = { ...selection };
                          if (checked) delete next[opt.id];
                          else next[opt.id] = v.id;
                          onChange(next);
                        }}
                      />
                      <span className="flex-1 text-sm">{t(v.label)}</span>
                      {v.priceDelta ? <span className="num text-xs text-mute">+{formatPrice(v.priceDelta, locale)}</span> : null}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          );
        }
        return (
          <fieldset key={opt.id}>
            <legend className="mb-3 flex w-full items-baseline justify-between gap-4">
              <span className="field-label">{t(opt.name)}</span>
              <span className="text-sm">{current ? t(current.label) : fmt(dict.product.selectOption, { option: t(opt.name) })}</span>
            </legend>
            <div className="flex flex-wrap gap-2.5">
              {opt.values.map((v) => {
                const active = selection[opt.id] === v.id;
                return (
                  <label
                    key={v.id}
                    title={t(v.label)}
                    className={cn(
                      "relative cursor-pointer transition-all duration-300",
                      swatch
                        ? cn("size-10 rounded-full ring-offset-2 ring-offset-ivory", active ? "ring-1 ring-charcoal" : "hover:ring-1 hover:ring-line-strong")
                        : cn("border px-4 py-2.5 text-sm", active ? "border-charcoal bg-charcoal text-ivory" : "hairline hover:border-charcoal"),
                    )}
                  >
                    <input type="radio" name={`opt-${product.id}-${opt.id}`} value={v.id} checked={active} onChange={() => onChange({ ...selection, [opt.id]: v.id })} className="sr-only" />
                    {swatch ? (
                      <>
                        <span className="absolute inset-0 rounded-full border border-charcoal/10" style={{ background: v.hex }} aria-hidden />
                        <span className="sr-only">{t(v.label)}</span>
                      </>
                    ) : (
                      <>
                        {t(v.label)}
                        {v.priceDelta ? <span className={cn("num ms-2 text-xs", active ? "text-ivory/70" : "text-mute")}>{v.priceDelta > 0 ? "+" : "−"}{formatPrice(Math.abs(v.priceDelta), locale)}</span> : null}
                      </>
                    )}
                  </label>
                );
              })}
            </div>
          </fieldset>
        );
      })}
    </div>
  );
}

export function ProductView({ product, categoryName, compact = false }: { product: Product; categoryName: string; compact?: boolean }) {
  const { dict, href, locale, t } = useI18n();
  const [selection, setSelection] = useState<Selection>(() => resolveVariant(product).selection);
  const [imageIndex, setImageIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const addRef = useRef<HTMLDivElement>(null);
  const [showSticky, setShowSticky] = useState(false);

  const resolved = useMemo(() => resolveVariant(product, selection), [product, selection]);
  const purchasable = isPurchasable(resolved.availability);
  const selectionText = describeSelection(product, resolved.selection)
    .map((s) => `${t(s.option)}: ${t(s.value)}`)
    .join(" · ");
  const url = absoluteUrl(href(`/products/${product.slug}`));
  const waMessage = [fmt(dict.whatsappMessages.product, { product: t(product.name) }), selectionText, `${dict.product.sku}: ${resolved.sku}`, fmt(dict.whatsappMessages.productLink, { url })]
    .filter(Boolean)
    .join("\n");

  useEffect(() => {
    if (!compact) recent.push(product.id);
  }, [product.id, compact]);

  // Sticky mobile purchase bar appears once the main CTA scrolls away.
  useEffect(() => {
    if (compact || !addRef.current) return;
    const io = new IntersectionObserver(([e]) => setShowSticky(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(addRef.current);
    return () => io.disconnect();
  }, [compact]);

  const onSelection = (s: Selection) => {
    setSelection(s);
    const next = resolveVariant(product, s);
    if (next.imageIndex !== resolved.imageIndex) setImageIndex(next.imageIndex);
  };

  const onIndex = useCallback((i: number) => setImageIndex(i), []);

  const add = () => {
    cart.add(product.id, resolved.selection, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: t(product.name), url });
      else {
        await navigator.clipboard.writeText(url);
        toast(dict.common.copied);
      }
    } catch {
      /* user cancelled */
    }
  };

  const saving = resolved.compareAtPrice ? resolved.compareAtPrice - resolved.price : 0;

  const purchase = (
    <div className="flex flex-col">
      <p className="eyebrow text-mute">
        {product.collection ? t(product.collection) : categoryName}
      </p>
      {compact ? (
        <h2 className="font-display mt-4 text-h3">{t(product.name)}</h2>
      ) : (
        <h1 className="font-display mt-4 text-h2">{t(product.name)}</h1>
      )}
      <p className="lead mt-4 !text-base text-mute">{t(product.shortDescription)}</p>

      <div className="mt-7 flex flex-wrap items-end justify-between gap-4 border-b hairline pb-7">
        <div>
          <Price amount={resolved.price} compareAt={resolved.compareAtPrice} locale={locale} size="lg" />
          {saving > 0 && <p className="mt-1 text-xs text-success">{fmt(dict.product.save, { amount: formatPrice(saving, locale) })}</p>}
        </div>
        <AvailabilityLabel value={resolved.availability} />
      </div>

      {product.options.length > 0 && (
        <div className="border-b hairline py-7">
          <VariantSelector product={product} selection={resolved.selection} onChange={onSelection} />
        </div>
      )}

      <div ref={addRef} className="flex flex-col gap-3 pt-7">
        <div className="flex gap-3">
          <QuantityStepper value={qty} onChange={(n) => setQty(Math.max(1, Math.min(99, n)))} />
          <button type="button" onClick={add} disabled={!purchasable} className="btn btn-primary flex-1">
            {added ? <Icon name="check" size={18} /> : <Icon name="bag" size={18} />}
            {purchasable ? (added ? dict.product.added : dict.product.addToCart) : dict.product.unavailable}
          </button>
        </div>
        <a href={whatsappLink(waMessage)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
          <Icon name="whatsapp" size={18} /> {dict.product.whatsapp}
        </a>
        {!compact && (
          <Link href={href("/showroom")} className="btn btn-outline">
            <Icon name="pin" size={18} /> {dict.product.visit}
          </Link>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
        <WishlistButton productId={product.id} label />
        <CompareButton productId={product.id} />
        <button type="button" onClick={share} className="inline-flex items-center gap-2">
          <Icon name="share" size={18} /> {dict.common.share}
        </button>
      </div>
      <p className="num mt-6 text-[11px] tracking-wider text-mute">
        {dict.product.sku}: {resolved.sku}
      </p>
      {product.demo && siteConfig.demoCatalog && <p className="mt-3 border-s-2 border-bronze ps-3 text-xs leading-relaxed text-mute">{dict.demo.productNote}</p>}
    </div>
  );

  if (compact) return purchase;

  const d = product.dimensions;
  return (
    <>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <ProductGallery product={product} index={imageIndex} onIndex={onIndex} />
        </div>
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
            {purchase}
            <Accordion
              className="mt-10"
              defaultOpen={0}
              items={[
                { title: dict.product.description, content: <p>{t(product.description)}</p> },
                ...(product.features.length
                  ? [{ title: dict.product.features, content: <ul className="list-inside list-disc space-y-1">{product.features.map((f, i) => <li key={i}>{t(f)}</li>)}</ul> }]
                  : []),
                { title: dict.product.materials, content: <ul className="space-y-1">{product.materials.map((m, i) => <li key={i}>{t(m)}</li>)}</ul> },
                ...(d
                  ? [
                      {
                        title: dict.product.dimensions,
                        content: (
                          <dl className="grid grid-cols-3 gap-4 text-center">
                            {[
                              [dict.product.width, d.width],
                              [dict.product.depth, d.depth],
                              [dict.product.height, d.height],
                            ].map(([k, v]) => (
                              <div key={k as string} className="border hairline py-4">
                                <dt className="text-xs text-mute">{k}</dt>
                                <dd className="num mt-1 text-lg">{v} <span className="text-xs">{locale === "ar" ? "سم" : "cm"}</span></dd>
                              </div>
                            ))}
                          </dl>
                        ),
                      },
                    ]
                  : []),
                { title: dict.product.care, content: <p>{product.care ? t(product.care) : dict.product.careDefault}</p> },
                { title: dict.product.delivery, content: <p>{dict.product.deliveryText}</p> },
                {
                  title: dict.product.returns,
                  content: (
                    <p>
                      {dict.product.returnsText}{" "}
                      <Link href={href("/returns-policy")} className="underline underline-offset-4">{dict.footer.returns}</Link>
                    </p>
                  ),
                },
                {
                  title: dict.product.customization,
                  content: (
                    <div className="flex flex-col items-start gap-4">
                      <p>{dict.product.customizationText}</p>
                      <Link href={href("/custom-furniture")} className="link-line text-sm">{dict.product.customizationCta}</Link>
                    </div>
                  ),
                },
                {
                  title: dict.product.faq,
                  content: (
                    <dl className="space-y-4">
                      {dict.product.faqItems.map((f) => (
                        <div key={f.q}>
                          <dt className="font-medium">{f.q}</dt>
                          <dd className="mt-1 text-mute">{f.a}</dd>
                        </div>
                      ))}
                    </dl>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Sticky mobile purchase bar */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-[var(--bottom-nav-h)] z-[60] border-t hairline bg-ivory/95 backdrop-blur-xl transition-transform duration-500 lg:hidden",
          showSticky ? "translate-y-0" : "translate-y-[calc(100%+var(--bottom-nav-h))]",
        )}
        aria-hidden={!showSticky}
      >
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-mute">{t(product.name)}</p>
            <Price amount={resolved.price} locale={locale} size="sm" />
          </div>
          <a href={whatsappLink(waMessage)} target="_blank" rel="noopener noreferrer" tabIndex={showSticky ? 0 : -1} className="grid size-12 place-items-center bg-[#1f3b2d] text-ivory" aria-label={dict.product.whatsapp}>
            <Icon name="whatsapp" size={20} />
          </a>
          <button type="button" onClick={add} disabled={!purchasable} tabIndex={showSticky ? 0 : -1} className="btn btn-primary !min-h-12 !px-5">
            {added ? dict.product.added : dict.product.addToCart}
          </button>
        </div>
      </div>
    </>
  );
}
