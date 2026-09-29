"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { articles } from "@/data/content/articles";
import { useI18n } from "@/i18n/provider";
import { fmt } from "@/i18n/config";
import { normalizeText, searchCategories, searchProducts } from "@/lib/catalog";
import { recentSearchStore, recentSearches, ui } from "@/store/stores";
import { Icon } from "../ui/Icon";
import { Price } from "../ui/primitives";
import { useDialog } from "./useDialog";

export function SearchOverlay() {
  const { dict, href, locale, t } = useI18n();
  const router = useRouter();
  const { searchOpen } = ui.use();
  const { terms } = recentSearchStore.use();
  const [q, setQ] = useState("");
  const dq = useDeferredValue(q);
  const close = () => ui.set((u) => ({ ...u, searchOpen: false }));
  const ref = useDialog<HTMLDivElement>(searchOpen, close);

  // "/" opens search on desktop (ignored while typing in a field).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !/INPUT|TEXTAREA|SELECT/.test(el.tagName) && !el.isContentEditable) {
        e.preventDefault();
        ui.set((u) => ({ ...u, searchOpen: true }));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    if (dq.trim().length < 1) return null;
    const nq = normalizeText(dq);
    return {
      products: searchProducts(dq, locale, 6),
      categories: searchCategories(dq).slice(0, 4),
      articles: articles.filter((a) => normalizeText(`${a.title.ar} ${a.title.en}`).includes(nq)).slice(0, 3),
    };
  }, [dq, locale]);

  const submit = (term: string) => {
    if (!term.trim()) return;
    recentSearches.push(term);
    close();
    router.push(`${href("/search")}?q=${encodeURIComponent(term.trim())}`);
  };

  const empty = results && !results.products.length && !results.categories.length && !results.articles.length;

  return (
    <>
      <div className="overlay-backdrop" data-open={searchOpen} onClick={close} aria-hidden />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={dict.search.title}
        className={`fixed inset-x-0 top-0 z-[90] max-h-[100dvh] overflow-y-auto bg-ivory transition-[transform,visibility] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${searchOpen ? "visible translate-y-0" : "invisible -translate-y-full"}`}
      >
        <div className="container-x py-6 md:py-10">
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              submit(q);
            }}
            className="flex items-center gap-4 border-b border-charcoal pb-4"
          >
            <Icon name="search" size={26} className="shrink-0" />
            <label htmlFor="site-search" className="sr-only">{dict.search.title}</label>
            <input
              id="site-search"
              data-autofocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={dict.search.placeholder}
              autoComplete="off"
              className="font-display min-w-0 flex-1 bg-transparent text-2xl outline-none placeholder:text-taupe md:text-5xl"
            />
            <button type="button" onClick={close} className="grid size-11 shrink-0 place-items-center" aria-label={dict.nav.close}>
              <Icon name="close" size={24} />
            </button>
          </form>
          <p className="mt-3 hidden text-xs text-mute lg:block">{dict.search.hint}</p>

          {!results && (
            <div className="grid gap-10 py-10 md:grid-cols-2">
              {terms.length > 0 && (
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <p className="eyebrow text-mute">{dict.search.recent}</p>
                    <button type="button" onClick={recentSearches.clear} className="text-xs text-mute underline">{dict.search.clearRecent}</button>
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    {terms.map((term) => (
                      <li key={term}>
                        <button type="button" onClick={() => submit(term)} className="border hairline px-4 py-2 text-sm hover:border-charcoal">{term}</button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <p className="eyebrow mb-4 text-mute">{dict.search.popular}</p>
                <ul className="flex flex-wrap gap-2">
                  {dict.search.popularTerms.map((term) => (
                    <li key={term}>
                      <button type="button" onClick={() => setQ(term)} className="border hairline px-4 py-2 text-sm hover:border-charcoal">{term}</button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {results && (
            <div className="py-8" aria-live="polite">
              {empty && <p className="py-10 text-mute">{fmt(dict.search.noResults, { q: dq })}</p>}
              {results.categories.length > 0 && (
                <div className="mb-8 flex flex-wrap items-center gap-3">
                  <span className="eyebrow text-mute me-2">{dict.search.categories}</span>
                  {results.categories.map((c) => (
                    <Link key={c.slug} href={href(`/categories/${c.slug}`)} onClick={() => recentSearches.push(q)} className="border hairline px-4 py-2 text-sm hover:border-charcoal">
                      {t(c.name)}
                    </Link>
                  ))}
                </div>
              )}
              {results.products.length > 0 && (
                <>
                  <p className="eyebrow mb-4 text-mute">{dict.search.products}</p>
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-6">
                    {results.products.map((p) => (
                      <li key={p.id}>
                        <Link href={href(`/products/${p.slug}`)} onClick={() => recentSearches.push(q)} className="group block">
                          <div className="relative aspect-[4/5] overflow-hidden bg-stone">
                            <Image src={p.images[0].src} alt={t(p.images[0].alt)} fill sizes="(min-width:1024px) 16vw, 45vw" className="zoom-on-hover object-cover" />
                          </div>
                          <p className="mt-3 text-sm">{t(p.name)}</p>
                          <Price amount={p.price} locale={locale} size="sm" className="mt-1 text-mute" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {results.articles.length > 0 && (
                <div className="mt-10">
                  <p className="eyebrow mb-4 text-mute">{dict.search.articles}</p>
                  <ul className="divide-y hairline border-y hairline">
                    {results.articles.map((a) => (
                      <li key={a.slug}>
                        <Link href={href(`/inspiration/${a.slug}`)} className="flex items-center justify-between py-4 hover:text-wood">
                          {t(a.title)} <Icon name="arrow" size={16} className="flip-rtl" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {!empty && (
                <button type="button" onClick={() => submit(q)} className="btn btn-outline mt-10">
                  {dict.search.viewAll} <Icon name="arrow" size={16} className="flip-rtl" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
