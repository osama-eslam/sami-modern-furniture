import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { business } from "@/config/business";
import { images } from "@/data/demo/images";
import { isLocale, localePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { buildMetadata } from "@/lib/seo";
import { Parallax } from "@/components/home/client-bits";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow, IllustrativeTag, ImageHero, SectionHeading, SplitLines } from "@/components/ui/primitives";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return buildMetadata({ locale, path: "/about", title: dict.nav.about, description: dict.about.heroBody });
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const a = dict.about;
  const h = (p: string) => localePath(locale, p);

  const pillars = [
    { title: a.designTitle, body: a.designBody, img: images.consoleRattan },
    { title: a.craftTitle, body: a.craftBody, img: images.sideTable },
    { title: a.experienceTitle, body: a.experienceBody, img: images.livingChairs },
  ];

  return (
    <>
      <ImageHero
        eyebrow={a.eyebrow}
        title={a.heroTitle}
        body={a.heroBody}
        image={{ src: images.editorialLiving.src, alt: images.editorialLiving.alt[locale] }}
        imageNote={dict.demo.imageNote}
        breadcrumbs={[
          { name: dict.nav.home, href: h("/") },
          { name: dict.nav.about, href: h("/about") },
        ]}
      />

      {/* Story + years */}
      <section className="section" aria-labelledby="story-title">
        <div className="container-x grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Eyebrow className="mb-6">01 — {a.storyTitle}</Eyebrow>
            <p className="num font-latin text-[clamp(6rem,16vw,14rem)] font-extralight leading-[0.8] tracking-[-0.06em]" data-reveal>
              {business.experienceYears}
              <span className="text-bronze">+</span>
            </p>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-mute" data-reveal>
              {a.yearsLabel}
            </p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <h2 id="story-title" className="font-display text-h1">
              <SplitLines lines={[dict.home.statement1]} as="p" />
              <SplitLines lines={[dict.home.statement2]} as="p" className="mt-2 text-taupe" baseDelay={180} />
            </h2>
            <p className="lead mt-10 max-w-2xl" data-reveal>
              {a.storyBody}
            </p>
          </div>
        </div>
      </section>

      {/* Parallax image band */}
      <section className="relative h-[60vh] min-h-[380px] overflow-hidden bg-charcoal md:h-[80vh]" aria-hidden>
        <Parallax speed={0.18} className="absolute inset-0 -top-[12%] h-[124%]">
          <Image src={images.openLiving.src} alt="" fill sizes="100vw" className="object-cover" />
        </Parallax>
        <div className="absolute inset-0 bg-charcoal/15" />
        <IllustrativeTag label={dict.demo.imageNote} />
      </section>

      {/* Vision / mission / philosophy */}
      <section className="section" aria-label={`${a.visionTitle} · ${a.missionTitle}`}>
        <div className="container-x">
          <div className="grid gap-px bg-line md:grid-cols-3">
            {[
              { n: "02", t: a.visionTitle, b: a.visionBody },
              { n: "03", t: a.missionTitle, b: a.missionBody },
              { n: "04", t: a.philosophyTitle, b: a.philosophyBody },
            ].map((x, i) => (
              <article key={x.t} className="flex flex-col bg-ivory py-10 md:px-8 md:py-4 md:first:ps-0" data-reveal style={{ "--reveal-delay": `${i * 110}ms` } as React.CSSProperties}>
                <span className="num text-xs text-taupe">{x.n}</span>
                <h2 className="font-display mt-5 text-h2">{x.t}</h2>
                <p className="mt-6 max-w-sm leading-relaxed text-ink">{x.b}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Concept: from idea to complete home */}
      <section className="relative overflow-hidden bg-charcoal text-ivory on-dark" aria-labelledby="concept-title">
        <div className="container-x py-20 md:py-32">
          <Eyebrow className="mb-6 !text-ivory/55">05 — {a.scopeTitle}</Eyebrow>
          <h2 id="concept-title" className="font-display text-mega max-w-5xl">
            <SplitLines lines={[a.conceptTitle]} as="p" />
          </h2>
          <ol className="mt-16 grid grid-cols-2 border-t border-ivory/15 sm:grid-cols-3 lg:grid-cols-5">
            {dict.home.storySteps.map((s, i) => (
              <li key={s} className="border-b border-ivory/15 py-6 pe-4" data-reveal style={{ "--reveal-delay": `${(i % 5) * 70}ms` } as React.CSSProperties}>
                <span className="num text-[11px] text-bronze">{String(i + 1).padStart(2, "0")}</span>
                <p className="font-display mt-3 text-2xl md:text-3xl">{s}</p>
              </li>
            ))}
          </ol>
          <ul className="mt-14 flex flex-wrap gap-2">
            {business.scope.map((s) => (
              <li key={s.en} className="border border-ivory/20 px-4 py-2 text-sm text-ivory/80">
                {s[locale]}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Pillars */}
      <section className="section" aria-labelledby="values-title">
        <div className="container-x">
          <SectionHeading eyebrow="06 — SAMY MODERN" title={a.valuesTitle} />
          <div className="mt-16 grid gap-14 md:grid-cols-3 md:gap-6">
            {pillars.map((p, i) => (
              <article key={p.title} className={i === 1 ? "md:mt-24" : i === 2 ? "md:mt-12" : ""}>
                <div className="relative aspect-[3/4] overflow-hidden bg-stone" data-reveal="image" style={{ "--reveal-delay": `${i * 120}ms` } as React.CSSProperties}>
                  <div className="absolute inset-0">
                    <Image src={p.img.src} alt={p.img.alt[locale]} fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover" />
                  </div>
                </div>
                <div className="mt-6 flex gap-5 border-t hairline pt-5" data-reveal>
                  <span className="num text-xs text-mute">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-display text-h3">{p.title}</h3>
                    <p className="mt-3 max-w-xs text-sm leading-relaxed text-mute">{p.body}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t hairline">
        <div className="container-x flex flex-col items-start gap-10 py-20 md:flex-row md:items-end md:justify-between md:py-28">
          <h2 className="font-display text-h1 max-w-3xl">
            <SplitLines lines={[dict.home.showroomTitle]} as="p" />
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link href={h("/showroom")} className="btn btn-primary">
              {a.cta} <Icon name="arrow" size={16} className="flip-rtl" />
            </Link>
            <Link href={h("/custom-furniture")} className="btn btn-outline">
              {dict.nav.custom}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
