import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { business, primaryBranch } from "@/config/business";
import { categories } from "@/data/categories";
import { articles } from "@/data/content/articles";
import { beforeAfterPairs, galleryItems } from "@/data/content/gallery";
import { images } from "@/data/demo/images";
import { isLocale, localePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { bestSellers, featuredProducts, newArrivals } from "@/lib/catalog";
import { formatPhone, formatTime } from "@/lib/format";
import { buildMetadata } from "@/lib/seo";
import { telLink, whatsappLink } from "@/lib/whatsapp";
import { BeforeAfter } from "@/components/gallery/BeforeAfter";
import { OpenStatus, Parallax } from "@/components/home/client-bits";
import { Hero } from "@/components/home/Hero";
import { SocialLinks } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductRail } from "@/components/product/ProductRail";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow, IllustrativeTag, SectionHeading, SplitLines } from "@/components/ui/primitives";

export async function generateMetadata({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return buildMetadata({ locale, path: "/" });
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const h = (p: string) => localePath(locale, p);
  const quick = categories.filter((c) => c.featured);
  const featured = featuredProducts(6);
  const pair = beforeAfterPairs[0];

  return (
    <>
      <Hero locale={locale} dict={dict} />

      {/* 02 — Quick categories */}
      <section className="section !pb-0" aria-labelledby="cats-title">
        <div className="container-x">
          <div className="flex items-end justify-between gap-6">
            <div>
              <Eyebrow className="mb-5">{dict.home.categoriesEyebrow}</Eyebrow>
              <h2 id="cats-title" className="font-display text-h2">
                <SplitLines lines={[dict.home.categoriesTitle]} as="p" />
              </h2>
            </div>
            <Link href={h("/categories")} className="link-line label hidden shrink-0 md:inline-flex">
              {dict.nav.viewAll} <Icon name="arrow" size={16} className="flip-rtl" />
            </Link>
          </div>
        </div>
        <ul className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-3 overflow-x-auto px-[var(--gutter)] scroll-px-[var(--gutter)] md:gap-4">
          {quick.map((c, i) => (
            <li key={c.slug} className="w-[68vw] shrink-0 snap-start sm:w-[42vw] lg:w-[26vw] 3xl:w-[22vw]" data-reveal style={{ "--reveal-delay": `${(i % 4) * 90}ms` } as React.CSSProperties}>
              <Link href={h(`/categories/${c.slug}`)} className="group relative block aspect-[3/4] overflow-hidden bg-stone">
                <Image src={c.image.src} alt={c.image.alt[locale]} fill sizes="(min-width:1024px) 26vw, 68vw" className="zoom-on-hover object-cover" />
                <span className="absolute inset-0 bg-gradient-to-t from-charcoal/75 via-charcoal/5 to-transparent" />
                <span className="num absolute start-5 top-5 text-xs tracking-widest text-ivory/80">{String(i + 1).padStart(2, "0")}</span>
                <span className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3 text-ivory">
                  <span>
                    <span className="font-display block text-3xl md:text-4xl">{c.name[locale]}</span>
                    <span className="mt-2 block text-xs text-ivory/70">{c.tagline[locale]}</span>
                  </span>
                  <span className="grid size-11 shrink-0 place-items-center border border-ivory/40 transition-colors duration-500 group-hover:bg-ivory group-hover:text-charcoal">
                    <Icon name="arrowUpRight" size={18} className="flip-rtl" />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 03 — Brand statement */}
      <section className="section overflow-hidden" aria-labelledby="statement">
        <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <Eyebrow className="mb-8">{dict.home.statementEyebrow}</Eyebrow>
            <h2 id="statement" className="font-display text-mega">
              <SplitLines lines={[dict.home.statement1]} as="p" />
              <SplitLines lines={[dict.home.statement2]} as="p" className="mt-3 text-taupe" baseDelay={200} />
            </h2>
            <p className="lead mt-10 max-w-xl" data-reveal>
              {dict.home.statementBody}
            </p>
            <Link href={h("/about")} className="link-line label mt-10" data-reveal>
              {dict.nav.about} <Icon name="arrow" size={16} className="flip-rtl" />
            </Link>
          </div>
          <div className="relative lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden" data-reveal="image">
              <div className="absolute inset-0">
                <Image src={images.editorialLiving.src} alt={images.editorialLiving.alt[locale]} fill sizes="(min-width:1024px) 38vw, 100vw" className="object-cover" />
              </div>
            </div>
            <div className="absolute -bottom-10 -start-6 hidden w-1/2 overflow-hidden border-[10px] border-ivory md:block lg:-start-24" data-reveal="image" style={{ "--reveal-delay": "200ms" } as React.CSSProperties}>
              <div className="relative aspect-square">
                <Image src={images.kitchenDetail.src} alt={images.kitchenDetail.alt[locale]} fill sizes="20vw" className="object-cover" />
              </div>
            </div>
            <p className="mt-4 text-xs text-mute md:ms-[55%]">{dict.demo.imageNote}</p>
          </div>
        </div>
      </section>

      {/* 04 — Featured collection */}
      <section className="section bg-paper" aria-labelledby="featured-title">
        <div className="container-x">
          <SectionHeading eyebrow={dict.home.featuredEyebrow} title={dict.home.featuredTitle} action={{ href: h("/shop"), label: dict.nav.viewAll }} />
          <div className="mt-14 grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-12">
            <Link href={h(`/products/${featured[0].slug}`)} className="group relative block overflow-hidden bg-stone md:col-span-2 lg:col-span-6 lg:row-span-2" data-reveal="image">
              <div className="relative aspect-[4/5] h-full lg:aspect-auto lg:min-h-[760px]">
                <Image src={featured[0].images[0].src} alt={featured[0].images[0].alt[locale]} fill sizes="(min-width:1024px) 50vw, 100vw" className="zoom-on-hover object-cover" />
                <span className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent" />
                <span className="absolute inset-x-6 bottom-6 text-ivory md:inset-x-10 md:bottom-10">
                  <span className="eyebrow block text-ivory/70">{featured[0].collection?.[locale]}</span>
                  <span className="font-display mt-3 block text-h2">{featured[0].name[locale]}</span>
                  <span className="link-line label mt-5">{dict.nav.explore}</span>
                </span>
              </div>
            </Link>
            {featured.slice(1, 5).map((p, i) => (
              <div key={p.id} className="lg:col-span-3">
                <ProductCard product={p} index={i} sizes="(min-width:1024px) 23vw, 50vw" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 05 — New arrivals */}
      <section className="section" aria-labelledby="new-title">
        <div className="container-x">
          <SectionHeading eyebrow={dict.home.newEyebrow} title={dict.home.newTitle} action={{ href: h("/shop/new-arrivals"), label: dict.nav.viewAll }} />
          <div className="mt-14">
            <ProductRail products={newArrivals(8)} label={dict.home.newTitle} />
          </div>
        </div>
      </section>

      {/* 06 — Editorial story: from idea to home */}
      <section className="relative overflow-hidden bg-charcoal text-ivory on-dark" aria-labelledby="story-title">
        <div className="relative h-[70vh] min-h-[480px] overflow-hidden">
          <Parallax speed={0.2} className="absolute inset-0 -top-[10%] h-[120%]">
            <Image src={images.openLiving.src} alt={images.openLiving.alt[locale]} fill sizes="100vw" className="object-cover opacity-70" />
          </Parallax>
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/30 via-transparent to-charcoal" />
          <div className="container-x relative flex h-full flex-col justify-end pb-12">
            <Eyebrow className="mb-6 !text-ivory/60">{dict.home.storyEyebrow}</Eyebrow>
            <h2 id="story-title" className="font-display text-mega max-w-5xl">
              <SplitLines lines={[dict.home.storyTitle]} as="p" />
            </h2>
          </div>
        </div>
        <div className="border-y border-ivory/10 py-8" aria-hidden>
          <div className="flex w-max marquee-track">
            {[0, 1].map((k) => (
              <ul key={k} className="flex shrink-0 items-center">
                {dict.home.storySteps.map((s, i) => (
                  <li key={s} className="font-display flex items-center whitespace-nowrap px-8 text-4xl text-ivory/85 md:text-6xl">
                    <span className="num me-5 text-xs text-bronze">{String(i + 1).padStart(2, "0")}</span>
                    {s}
                    <span className="ms-16 text-ivory/25">—</span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
        <ol className="sr-only">
          {dict.home.storySteps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        <div className="container-x grid gap-10 py-16 md:grid-cols-2 md:py-24">
          <p className="lead !text-ivory/80 max-w-xl" data-reveal>
            {dict.home.storyBody}
          </p>
          <ul className="flex flex-wrap content-start gap-2 md:justify-end" data-reveal>
            {business.scope.map((s) => (
              <li key={s.en} className="border border-ivory/20 px-4 py-2 text-sm text-ivory/80">
                {s[locale]}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 07 — Best sellers */}
      <section className="section" aria-labelledby="best-title">
        <div className="container-x">
          <SectionHeading eyebrow={dict.home.bestEyebrow} title={dict.home.bestTitle} action={{ href: h("/shop/best-sellers"), label: dict.nav.viewAll }} />
          <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 lg:grid-cols-4">
            {bestSellers(4).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* 08 — Before / After */}
      <section className="section !pt-0" aria-labelledby="ba-title">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-4">
            <Eyebrow className="mb-5">{dict.home.beforeAfterEyebrow}</Eyebrow>
            <h2 id="ba-title" className="font-display text-h2">
              <SplitLines lines={[dict.home.beforeAfterTitle]} as="p" />
            </h2>
            <p className="mt-6 max-w-sm border-s-2 border-bronze ps-4 text-sm text-mute">{dict.home.beforeAfterNote}</p>
            <Link href={h("/gallery")} className="link-line label mt-10">
              {dict.nav.gallery} <Icon name="arrow" size={16} className="flip-rtl" />
            </Link>
          </div>
          <div className="lg:col-span-8" data-reveal>
            <BeforeAfter before={pair.before} after={pair.after} />
          </div>
        </div>
      </section>

      {/* 09 — Custom furniture */}
      <section className="relative overflow-hidden bg-walnut text-ivory on-dark" aria-labelledby="custom-title">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[420px] overflow-hidden lg:min-h-[760px]" data-reveal="image">
            <div className="absolute inset-0">
              <Image src={images.kitchenDark.src} alt={images.kitchenDark.alt[locale]} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
            </div>
            <IllustrativeTag label={dict.demo.imageNote} />
          </div>
          <div className="flex flex-col justify-center px-[var(--gutter)] py-20 lg:px-20">
            <Eyebrow className="mb-6 !text-ivory/60">{dict.home.customEyebrow}</Eyebrow>
            <h2 id="custom-title" className="font-display text-h1">
              <SplitLines lines={dict.home.customTitle.split(". ").map((s, i, a) => (i < a.length - 1 ? `${s}.` : s))} as="p" />
            </h2>
            <p className="lead mt-8 max-w-md !text-ivory/75" data-reveal>
              {dict.home.customBody}
            </p>
            <ol className="mt-10 grid gap-px border-y border-ivory/15 sm:grid-cols-3">
              {dict.custom.process.map((s, i) => (
                <li key={s.t} className="py-5 sm:pe-5">
                  <span className="num text-xs text-ivory/50">{String(i + 1).padStart(2, "0")}</span>
                  <p className="mt-2 font-medium">{s.t}</p>
                  <p className="mt-1 text-sm text-ivory/60">{s.d}</p>
                </li>
              ))}
            </ol>
            <div className="mt-10">
              <Link href={h("/custom-furniture")} className="btn btn-light">
                {dict.home.customCta} <Icon name="arrow" size={16} className="flip-rtl" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 10 — Materials / craftsmanship */}
      <section className="section" aria-labelledby="craft-title">
        <div className="container-x">
          <SectionHeading eyebrow={dict.home.craftEyebrow} title={dict.home.craftTitle} />
          <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-6">
            {dict.home.craftItems.map((item, i) => {
              const img = [images.sideTable, images.sofaOrange, images.consoleRattan][i];
              return (
                <article key={item.title} className={i === 1 ? "md:mt-24" : ""}>
                  <div className="relative aspect-[3/4] overflow-hidden bg-stone" data-reveal="image" style={{ "--reveal-delay": `${i * 120}ms` } as React.CSSProperties}>
                    <div className="absolute inset-0">
                      <Image src={img.src} alt={img.alt[locale]} fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover" />
                    </div>
                  </div>
                  <div className="mt-6 flex gap-5 border-t hairline pt-5" data-reveal>
                    <span className="num text-xs text-mute">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className="font-display text-h3">{item.title}</h3>
                      <p className="mt-3 max-w-xs text-sm leading-relaxed text-mute">{item.text}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 11 — Inspiration */}
      <section className="section bg-paper" aria-labelledby="insp-title">
        <div className="container-x">
          <SectionHeading eyebrow={dict.home.inspirationEyebrow} title={dict.home.inspirationTitle} action={{ href: h("/inspiration"), label: dict.nav.viewAll }} />
          <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-6">
            {articles.slice(0, 3).map((a, i) => (
              <Link key={a.slug} href={h(`/inspiration/${a.slug}`)} className="group block" data-reveal style={{ "--reveal-delay": `${i * 100}ms` } as React.CSSProperties}>
                <div className={`relative overflow-hidden bg-stone ${i === 0 ? "aspect-[4/5]" : "aspect-[4/5] md:aspect-square"}`}>
                  <Image src={a.hero.src} alt={a.hero.alt[locale]} fill sizes="(min-width:768px) 33vw, 100vw" className="zoom-on-hover object-cover" />
                </div>
                <p className="eyebrow mt-5 text-mute">
                  {dict.inspiration.topics[a.topic]} · {a.readingMinutes} {dict.common.minutes}
                </p>
                <h3 className="font-display mt-3 text-h3 group-hover:text-wood transition-colors">{a.title[locale]}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 12 — Showroom */}
      <section className="section" aria-labelledby="showroom-title">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="relative lg:col-span-7">
            <div className="relative aspect-[16/11] overflow-hidden bg-stone" data-reveal="image">
              <div className="absolute inset-0">
                <Image src={images.loft.src} alt={images.loft.alt[locale]} fill sizes="(min-width:1024px) 58vw, 100vw" className="object-cover" />
              </div>
              <IllustrativeTag label={dict.demo.imageNote} />
            </div>
          </div>
          <div className="flex flex-col justify-center lg:col-span-5">
            <Eyebrow className="mb-5">{dict.home.showroomEyebrow}</Eyebrow>
            <h2 id="showroom-title" className="font-display text-h1">
              <SplitLines lines={[dict.home.showroomTitle]} as="p" />
            </h2>
            <p className="lead mt-6">{dict.home.showroomBody}</p>
            <dl className="mt-10 divide-y hairline border-y hairline text-sm">
              <div className="grid grid-cols-3 gap-4 py-4">
                <dt className="text-mute">{dict.showroom.address}</dt>
                <dd className="col-span-2">
                  {primaryBranch.address[locale]}
                  <span className="mt-1 block text-xs text-mute">{primaryBranch.landmark?.[locale]}</span>
                </dd>
              </div>
              <div className="grid grid-cols-3 gap-4 py-4">
                <dt className="text-mute">{dict.showroom.hours}</dt>
                <dd className="col-span-2 num">
                  <OpenStatus className="mb-1 text-xs" />
                  <span className="block">
                    {formatTime(business.hours[1].open, locale)} – {formatTime(business.hours[1].close, locale)}
                  </span>
                  <span className="block text-xs text-mute">
                    {dict.showroom.days[5]} & {dict.showroom.days[0]}: {formatTime(business.hours[5].open, locale)} – {formatTime(business.hours[5].close, locale)}
                  </span>
                </dd>
              </div>
              <div className="grid grid-cols-3 gap-4 py-4">
                <dt className="text-mute">{dict.showroom.phone}</dt>
                <dd className="col-span-2">
                  <a href={telLink(business.phones.primary)} className="num hover:underline" dir="ltr">
                    {formatPhone(business.phones.primary)}
                  </a>
                </dd>
              </div>
            </dl>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={primaryBranch.directionsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                <Icon name="pin" size={16} /> {dict.common.getDirections}
              </a>
              <Link href={h("/showroom")} className="btn btn-outline">
                {dict.nav.showroom}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 13 — Gallery preview */}
      <section className="section !pt-0" aria-labelledby="gallery-title">
        <div className="container-x">
          <SectionHeading eyebrow={dict.home.galleryEyebrow} title={dict.home.galleryTitle} action={{ href: h("/gallery"), label: dict.nav.viewAll }} />
          <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-2 md:gap-4">
            {galleryItems.slice(0, 5).map((g, i) => (
              <Link
                key={g.id}
                href={h("/gallery")}
                className={`group relative block overflow-hidden bg-stone ${i === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto" : "aspect-square"}`}
                data-reveal
                style={{ "--reveal-delay": `${i * 70}ms` } as React.CSSProperties}
              >
                <Image src={g.image.src} alt={g.image.alt[locale]} fill sizes={i === 0 ? "(min-width:768px) 50vw, 100vw" : "(min-width:768px) 25vw, 50vw"} className="zoom-on-hover object-cover" />
                <span className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-charcoal/70 to-transparent p-4 text-sm text-ivory transition-transform duration-500 group-hover:translate-y-0">
                  {g.caption[locale]}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 14 — Social */}
      <section className="border-y hairline" aria-labelledby="social-title">
        <div className="container-x grid gap-10 py-20 md:grid-cols-12 md:items-center md:py-28">
          <div className="md:col-span-8">
            <Eyebrow className="mb-6">{dict.home.socialEyebrow}</Eyebrow>
            <a href={business.social.instagram} target="_blank" rel="noopener noreferrer" className="group inline-block" id="social-title">
              <span className="font-latin block text-[clamp(2.75rem,10vw,9rem)] font-extralight leading-none tracking-[-0.04em] transition-colors group-hover:text-wood" dir="ltr">
                {dict.home.socialTitle}
              </span>
            </a>
            <p className="lead mt-6 max-w-lg">{dict.home.socialBody}</p>
          </div>
          <div className="md:col-span-4 md:justify-self-end">
            <SocialLinks className="flex gap-2 text-charcoal [&_a]:border-line-strong [&_a:hover]:bg-charcoal [&_a:hover]:text-ivory" size={22} />
          </div>
        </div>
      </section>

      {/* 15 — WhatsApp CTA */}
      <section className="section" aria-labelledby="wa-title">
        <div className="container-x flex flex-col items-start gap-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <h2 id="wa-title" className="font-display text-h1">
              <SplitLines lines={[dict.home.whatsappTitle]} as="p" />
            </h2>
            <p className="lead mt-6">{dict.home.whatsappBody}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={whatsappLink(dict.whatsappMessages.general)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
              <Icon name="whatsapp" size={18} /> {dict.common.chatWhatsapp}
            </a>
            <a href={telLink(business.phones.primary)} className="btn btn-outline">
              <Icon name="phone" size={16} /> {dict.common.callUs}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
