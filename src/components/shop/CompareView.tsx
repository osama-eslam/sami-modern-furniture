"use client";

import Image from "next/image";
import Link from "next/link";
import { categoryBySlug } from "@/data/categories";
import { fmt } from "@/i18n/config";
import { useI18n } from "@/i18n/provider";
import { defaultSelection, isPurchasable, productsByIds } from "@/lib/catalog";
import { useHydrated } from "@/store/create-store";
import { cart, compare, compareStore, ui } from "@/store/stores";
import type { Product } from "@/types/commerce";
import { AvailabilityLabel } from "../product/ProductView";
import { Icon } from "../ui/Icon";
import { EmptyState, Price } from "../ui/primitives";

export function CompareView() {
  const { dict, href, locale, t } = useI18n();
  const hydrated = useHydrated();
  const { ids } = compareStore.use();
  const products = productsByIds(ids);

  if (!hydrated) return <div className="container-x min-h-[50vh]" />;
  if (!products.length) {
    return (
      <div className="container-x pb-24">
        <EmptyState icon="compare" title={dict.compare.empty} action={{ href: href("/shop"), label: dict.cart.continue }} />
      </div>
    );
  }

  const rows: { label: string; render: (p: Product) => React.ReactNode }[] = [
    { label: dict.compare.price, render: (p) => <Price amount={p.price} compareAt={p.compareAtPrice} locale={locale} /> },
    { label: dict.compare.category, render: (p) => t(categoryBySlug(p.category)?.name) },
    { label: dict.compare.availability, render: (p) => <AvailabilityLabel value={p.availability} /> },
    {
      label: dict.compare.dimensions,
      render: (p) =>
        p.dimensions ? (
          <span className="num" dir="ltr">
            {p.dimensions.width} × {p.dimensions.depth} × {p.dimensions.height} cm
          </span>
        ) : (
          dict.common.emptyValue
        ),
    },
    { label: dict.compare.materials, render: (p) => p.materials.map((m) => t(m)).join("، ") || dict.common.emptyValue },
    {
      label: dict.compare.colors,
      render: (p) => (
        <ul className="flex flex-wrap gap-1.5">
          {p.colors.map((c) => (
            <li key={c.hex} title={t(c.name)} className="size-5 rounded-full ring-1 ring-charcoal/15" style={{ background: c.hex }}>
              <span className="sr-only">{t(c.name)}</span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      label: dict.compare.features,
      render: (p) => (
        <ul className="space-y-1.5">
          {p.features.slice(0, 5).map((f) => (
            <li key={f.en} className="flex gap-2">
              <Icon name="check" size={14} className="mt-0.5 shrink-0 text-bronze" />
              {t(f)}
            </li>
          ))}
        </ul>
      ),
    },
  ];

  const add = (p: Product) => (p.options.length ? ui.set((u) => ({ ...u, quickViewId: p.id })) : cart.add(p.id, defaultSelection(p)));

  return (
    <div className="pb-24">
      <div className="container-x flex items-center justify-between border-b border-charcoal pb-4">
        <p className="num text-sm text-mute">{fmt(dict.compare.bar, { count: products.length })}</p>
        <button type="button" onClick={compare.clear} className="link-line text-sm">
          {dict.compare.clear}
        </button>
      </div>
      <div className="no-scrollbar overflow-x-auto">
        <div className="container-x">
          <table className="w-full min-w-[640px] table-fixed border-collapse text-sm">
            <colgroup>
              <col className="w-32 md:w-48" />
              {products.map((p) => (
                <col key={p.id} />
              ))}
            </colgroup>
            <thead>
              <tr>
                <th scope="col" className="sticky start-0 z-[1] bg-ivory">
                  <span className="sr-only">{dict.compare.title}</span>
                </th>
                {products.map((p) => (
                  <th key={p.id} scope="col" className="px-3 pt-8 pb-6 text-start align-top font-normal md:px-4">
                    <div className="relative">
                      <Link href={href(`/products/${p.slug}`)} className="group relative block aspect-[4/5] overflow-hidden bg-stone">
                        <Image src={p.images[0].src} alt={t(p.images[0].alt)} fill sizes="(min-width:1024px) 22vw, 200px" className="zoom-on-hover object-cover" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => compare.toggle(p.id)}
                        className="absolute end-2 top-2 grid size-9 place-items-center bg-ivory/90 transition-colors hover:bg-charcoal hover:text-ivory"
                        aria-label={`${dict.product.compareRemove} — ${t(p.name)}`}
                      >
                        <Icon name="close" size={16} />
                      </button>
                    </div>
                    <Link href={href(`/products/${p.slug}`)} className="mt-4 block font-medium leading-snug hover:underline underline-offset-4">
                      {t(p.name)}
                    </Link>
                    <button type="button" disabled={!isPurchasable(p.availability)} onClick={() => add(p)} className="btn btn-primary btn-sm mt-4 w-full">
                      <Icon name="bag" size={15} /> <span className="truncate">{p.options.length ? dict.product.quickView : dict.product.addToCart}</span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-t hairline">
                  <th scope="row" className="sticky start-0 z-[1] bg-ivory py-5 pe-4 text-start align-top text-xs font-medium text-mute">
                    {r.label}
                  </th>
                  {products.map((p) => (
                    <td key={p.id} className="px-3 py-5 align-top leading-relaxed md:px-4">
                      {r.render(p)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
