import Link from "next/link";
import { Suspense } from "react";
import { getDictionary } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/config";
import { allProducts, type Collection } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types/content";
import { PageHeader } from "../ui/primitives";
import { ShopView } from "./ShopView";

/** Shared server shell for /shop and its curated collections. */
export function ShopPage({ locale, collection, title, path, emptyText }: { locale: Locale; collection: Collection; title: string; path: string; emptyText?: string }) {
  const dict = getDictionary(locale);
  const h = (p: string) => localePath(locale, p);
  const tabs: [string, string][] = [
    ["/shop", dict.nav.allProducts],
    ["/shop/new-arrivals", dict.nav.newArrivals],
    ["/shop/best-sellers", dict.nav.bestSellers],
    ["/shop/offers", dict.nav.offers],
    ["/categories", dict.nav.categories],
  ];
  return (
    <>
      <PageHeader
        eyebrow={dict.shop.eyebrow}
        title={title}
        breadcrumbs={[
          { name: dict.nav.home, href: h("/") },
          { name: dict.nav.shop, href: h("/shop") },
          ...(path !== "/shop" ? [{ name: title, href: h(path) }] : []),
        ]}
      >
        <nav aria-label={dict.nav.shop} className="no-scrollbar -mx-[var(--gutter)] mt-12 overflow-x-auto px-[var(--gutter)]">
          <ul className="flex gap-2">
            {tabs.map(([p, label]) => (
              <li key={p}>
                <Link
                  href={h(p)}
                  aria-current={p === path ? "page" : undefined}
                  className={cn("block whitespace-nowrap border px-5 py-2.5 text-sm transition-colors", p === path ? "border-charcoal bg-charcoal text-ivory" : "hairline hover:border-charcoal")}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>
      <Suspense fallback={<div className="container-x min-h-[60vh]" />}>
        <ShopView products={allProducts()} collection={collection} emptyText={emptyText} />
      </Suspense>
    </>
  );
}
