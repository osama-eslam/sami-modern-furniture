import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { categories, categoryBySlug } from "@/data/categories";
import { isLocale, localePath, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { allProducts } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";
import { ShopView } from "@/components/shop/ShopView";
import { Breadcrumbs, Eyebrow, IllustrativeTag, SplitLines } from "@/components/ui/primitives";

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.flatMap((locale) => categories.map((c) => ({ locale, slug: c.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/categories/[slug]">) {
  const { locale, slug } = await params;
  const cat = categoryBySlug(slug);
  if (!isLocale(locale) || !cat) return {};
  const place = locale === "ar" ? "سامي مودرن، الإسكندرية" : "Samy Modern, Alexandria";
  return buildMetadata({ locale, path: `/categories/${slug}`, title: cat.name[locale], description: `${cat.name[locale]} — ${cat.tagline[locale]}. ${place}.` });
}

export default async function CategoryPage({ params }: PageProps<"/[locale]/categories/[slug]">) {
  const { locale, slug } = await params;
  const cat = categoryBySlug(slug);
  if (!isLocale(locale) || !cat) notFound();
  const dict = getDictionary(locale);
  const h = (p: string) => localePath(locale, p);
  const index = categories.findIndex((c) => c.slug === slug);
  const others = categories.filter((c) => c.slug !== slug);

  return (
    <>
      <header className="relative h-[72svh] min-h-[480px] overflow-hidden bg-charcoal text-ivory on-dark">
        <div className="ken-burns absolute inset-0">
          <Image src={cat.image.src} alt={cat.image.alt[locale]} fill priority sizes="100vw" className="object-cover opacity-80" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/20 to-charcoal/40" />
        <div className="container-x relative flex h-full flex-col justify-end pb-12 pt-[calc(var(--header-h)+var(--notice-h)+2rem)] md:pb-16">
          <Breadcrumbs
            tone="light"
            className="mb-auto"
            items={[
              { name: dict.nav.home, href: h("/") },
              { name: dict.nav.categories, href: h("/categories") },
              { name: cat.name[locale], href: h(`/categories/${slug}`) },
            ]}
          />
          <Eyebrow className="hero-fade mb-5 !text-ivory/70">
            SAMY MODERN / {String(index + 1).padStart(2, "0")} — {cat.name.en.toUpperCase()}
          </Eyebrow>
          <SplitLines lines={[cat.name[locale]]} as="h1" hero className="font-display text-mega" baseDelay={100} />
          <p className="hero-fade mt-5 max-w-lg text-ivory/80" style={{ "--line-delay": "300ms" } as React.CSSProperties}>
            {cat.tagline[locale]}
          </p>
        </div>
        <IllustrativeTag label={dict.demo.imageNote} />
      </header>

      <div className="pt-10">
        <Suspense fallback={<div className="container-x min-h-[60vh]" />}>
          <ShopView products={allProducts()} fixedCategory={slug} />
        </Suspense>
      </div>

      <nav aria-label={dict.nav.categories} className="border-t hairline">
        <div className="container-x py-16">
          <p className="eyebrow mb-6 text-mute">{dict.nav.categories}</p>
          <ul className="flex flex-wrap gap-x-8 gap-y-4">
            {others.map((c) => (
              <li key={c.slug}>
                <Link href={h(`/categories/${c.slug}`)} className="font-display text-2xl text-mute transition-colors hover:text-charcoal md:text-3xl">
                  {c.name[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}
