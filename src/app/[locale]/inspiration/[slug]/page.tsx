import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { business } from "@/config/business";
import { categoryBySlug } from "@/data/categories";
import { articleBySlug, articles } from "@/data/content/articles";
import { isLocale, localePath, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { productsByIds } from "@/lib/catalog";
import { formatDate } from "@/lib/format";
import { absoluteUrl, buildMetadata } from "@/lib/seo";
import { ProductCard } from "@/components/product/ProductCard";
import { Icon } from "@/components/ui/Icon";
import { Breadcrumbs, Eyebrow, JsonLd, SectionHeading, SplitLines } from "@/components/ui/primitives";
import { ShareButton } from "@/components/ui/ShareButton";

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.flatMap((locale) => articles.map((a) => ({ locale, slug: a.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/inspiration/[slug]">) {
  const { locale, slug } = await params;
  const article = articleBySlug(slug);
  if (!isLocale(locale) || !article) return {};
  return buildMetadata({
    locale,
    path: `/inspiration/${slug}`,
    title: article.title[locale],
    description: article.excerpt[locale],
    image: article.hero.src.replace("w=2400", "w=1200&h=630"),
    type: "article",
  });
}

export default async function ArticlePage({ params }: PageProps<"/[locale]/inspiration/[slug]">) {
  const { locale, slug } = await params;
  const article = articleBySlug(slug);
  if (!isLocale(locale) || !article) notFound();
  const dict = getDictionary(locale);
  const h = (p: string) => localePath(locale, p);
  const products = productsByIds(article.relatedProducts);
  const cats = article.relatedCategories.map(categoryBySlug).filter((c) => !!c);
  const idx = articles.findIndex((a) => a.slug === slug);
  const more = [2, 3, 4].map((n) => articles[(idx + n) % articles.length]).filter((a) => a.slug !== slug);
  const next = articles[(idx + 1) % articles.length];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title[locale],
          description: article.excerpt[locale],
          image: [article.hero.src],
          datePublished: article.publishedAt,
          inLanguage: locale,
          mainEntityOfPage: absoluteUrl(h(`/inspiration/${slug}`)),
          author: { "@type": "Organization", name: business.name[locale] },
          publisher: { "@type": "Organization", name: business.name[locale] },
        }}
      />

      <article>
        <header className="container-x pt-[calc(var(--header-h)+var(--notice-h)+2.5rem)] md:pt-[calc(var(--header-h)+var(--notice-h)+4rem)]">
          <Breadcrumbs
            className="mb-10"
            items={[
              { name: dict.nav.home, href: h("/") },
              { name: dict.nav.inspiration, href: h("/inspiration") },
              { name: article.title[locale], href: h(`/inspiration/${slug}`) },
            ]}
          />
          <div className="mx-auto max-w-4xl text-center">
            <Eyebrow className="hero-fade mb-6">
              {dict.inspiration.topics[article.topic]} · <span className="num">{article.readingMinutes}</span> {dict.common.minutes}
            </Eyebrow>
            <SplitLines lines={[article.title[locale]]} as="h1" hero className="font-display text-h1" baseDelay={80} />
            <p className="lead hero-fade mx-auto mt-8 max-w-2xl" style={{ "--line-delay": "250ms" } as React.CSSProperties}>
              {article.excerpt[locale]}
            </p>
            <div className="hero-fade mt-8 flex items-center justify-center gap-6 text-xs text-mute" style={{ "--line-delay": "350ms" } as React.CSSProperties}>
              <time dateTime={article.publishedAt} className="num">
                {formatDate(article.publishedAt, locale)}
              </time>
              <span className="h-3 w-px bg-line-strong" aria-hidden />
              <ShareButton title={article.title[locale]} className="text-xs hover:text-charcoal" />
            </div>
          </div>
        </header>

        <div className="container-x mt-12 md:mt-16">
          <div className="relative aspect-[4/3] overflow-hidden bg-stone md:aspect-[21/9]" data-reveal="image">
            <div className="absolute inset-0">
              <Image src={article.hero.src} alt={article.hero.alt[locale]} fill priority sizes="100vw" className="object-cover" />
            </div>
          </div>
          <p className="mt-3 text-xs text-mute">{dict.demo.imageNote}</p>
        </div>

        <div className="container-x py-16 md:py-24">
          <div className="prose-editorial mx-auto max-w-2xl">
            {article.body.map((block, i) => (
              <section key={i} className="mt-14 first:mt-0" data-reveal>
                {block.heading && (
                  <h2 className="font-display mb-5 flex items-baseline gap-4 text-h3">
                    <span className="num shrink-0 text-xs text-bronze">{String(i + 1).padStart(2, "0")}</span>
                    {block.heading[locale]}
                  </h2>
                )}
                <p>{block.text[locale]}</p>
                {block.image && (
                  <figure className="-mx-[var(--gutter)] mt-10 sm:mx-0 md:-mx-24">
                    <div className="relative aspect-[4/3] overflow-hidden bg-stone">
                      <Image src={block.image.src} alt={block.image.alt[locale]} fill sizes="(min-width:768px) 880px, 100vw" className="object-cover" />
                    </div>
                    <figcaption className="mt-3 px-[var(--gutter)] text-xs text-mute sm:px-0">{block.image.alt[locale]}</figcaption>
                  </figure>
                )}
              </section>
            ))}

            {cats.length > 0 && (
              <div className="mt-16 border-t hairline pt-8">
                <p className="eyebrow mb-4 text-mute">{dict.inspiration.relatedCategories}</p>
                <ul className="flex flex-wrap gap-2">
                  {cats.map((c) => (
                    <li key={c.slug}>
                      <Link href={h(`/categories/${c.slug}`)} className="inline-flex h-10 items-center gap-2 border hairline px-4 text-sm transition-colors hover:border-charcoal hover:bg-charcoal hover:text-ivory">
                        {c.name[locale]} <Icon name="arrowUpRight" size={14} className="flip-rtl" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </article>

      {products.length > 0 && (
        <section className="section bg-paper" aria-labelledby="related-title">
          <div className="container-x">
            <SectionHeading eyebrow="SAMY MODERN / SHOP THE STORY" title={dict.inspiration.related} action={{ href: h("/shop"), label: dict.inspiration.cta }} />
            <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 lg:grid-cols-4">
              {products.slice(0, 4).map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Next story */}
      <Link href={h(`/inspiration/${next.slug}`)} className="group relative block h-[60vh] min-h-[420px] overflow-hidden bg-charcoal text-ivory on-dark">
        <Image src={next.hero.src} alt="" fill sizes="100vw" className="zoom-on-hover object-cover opacity-60" />
        <span className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-charcoal/10" />
        <span className="container-x relative flex h-full flex-col justify-end pb-12 md:pb-16">
          <span className="eyebrow text-ivory/60">{dict.inspiration.more}</span>
          <span className="font-display mt-4 block max-w-4xl text-h1">{next.title[locale]}</span>
          <span className="link-line label mt-8 w-fit">
            {dict.common.readMore} <Icon name="arrow" size={16} className="flip-rtl" />
          </span>
        </span>
      </Link>

      {more.length > 0 && (
        <section className="section" aria-labelledby="more-title">
          <div className="container-x">
            <SectionHeading eyebrow="SAMY MODERN / JOURNAL" title={dict.inspiration.more} action={{ href: h("/inspiration"), label: dict.nav.viewAll }} />
            <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-6">
              {more.map((a, i) => (
                <Link key={a.slug} href={h(`/inspiration/${a.slug}`)} className="group block" data-reveal style={{ "--reveal-delay": `${i * 100}ms` } as React.CSSProperties}>
                  <div className="relative aspect-[4/5] overflow-hidden bg-stone">
                    <Image src={a.hero.src} alt={a.hero.alt[locale]} fill sizes="(min-width:768px) 33vw, 100vw" className="zoom-on-hover object-cover" />
                  </div>
                  <p className="eyebrow mt-5 text-mute">
                    {dict.inspiration.topics[a.topic]} · {a.readingMinutes} {dict.common.minutes}
                  </p>
                  <h3 className="font-display mt-3 text-h3 transition-colors group-hover:text-wood">{a.title[locale]}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
