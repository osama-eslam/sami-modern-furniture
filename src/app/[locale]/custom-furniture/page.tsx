import Image from "next/image";
import { notFound } from "next/navigation";
import { images } from "@/data/demo/images";
import { isLocale, localePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { buildMetadata } from "@/lib/seo";
import { whatsappLink } from "@/lib/whatsapp";
import { CustomRequestWizard } from "@/components/forms/CustomRequestWizard";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow, IllustrativeTag, ImageHero, SplitLines } from "@/components/ui/primitives";

export async function generateMetadata({ params }: PageProps<"/[locale]/custom-furniture">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return buildMetadata({ locale, path: "/custom-furniture", title: dict.nav.custom, description: dict.custom.heroBody });
}

export default async function CustomFurniturePage({ params }: PageProps<"/[locale]/custom-furniture">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const c = dict.custom;
  const h = (p: string) => localePath(locale, p);

  return (
    <>
      <ImageHero
        eyebrow={c.eyebrow}
        title={c.heroTitle}
        body={c.heroBody}
        image={{ src: images.kitchenDark.src, alt: images.kitchenDark.alt[locale] }}
        imageNote={dict.demo.imageNote}
        breadcrumbs={[
          { name: dict.nav.home, href: h("/") },
          { name: dict.nav.custom, href: h("/custom-furniture") },
        ]}
      >
        <div className="flex flex-wrap gap-3">
          <a href="#request" className="btn btn-light">
            {c.start} <Icon name="arrow" size={16} className="flip-rtl" />
          </a>
          <a href={whatsappLink(dict.whatsappMessages.general)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-light">
            <Icon name="whatsapp" size={18} /> {dict.nav.whatsapp}
          </a>
        </div>
      </ImageHero>

      {/* How it works */}
      <section className="section" aria-labelledby="process-title">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow className="mb-5">01 — {c.processTitle}</Eyebrow>
            <h2 id="process-title" className="font-display text-h1">
              <SplitLines lines={[c.processTitle]} as="p" />
            </h2>
          </div>
          <ol className="grid gap-px bg-line sm:grid-cols-3 lg:col-span-8">
            {c.process.map((s, i) => (
              <li key={s.t} className="bg-ivory py-8 sm:px-6 sm:first:ps-0" data-reveal style={{ "--reveal-delay": `${i * 110}ms` } as React.CSSProperties}>
                <span className="num font-latin text-5xl font-extralight text-stone">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-display mt-6 text-h3">{s.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-mute">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Wizard */}
      <section id="request" className="scroll-mt-[var(--header-h)] bg-paper" aria-labelledby="request-title">
        <div className="grid lg:grid-cols-12">
          <div className="relative hidden lg:col-span-4 lg:block">
            <div className="sticky top-[var(--header-h)] h-[calc(100svh-var(--header-h))] overflow-hidden">
              <Image src={images.wallDesk.src} alt={images.wallDesk.alt[locale]} fill sizes="33vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent" />
              <div className="absolute inset-x-10 bottom-10 text-ivory">
                <p className="eyebrow text-ivory/60">{c.eyebrow}</p>
                <p className="font-display mt-4 text-h3">{dict.home.customTitle}</p>
              </div>
              <IllustrativeTag label={dict.demo.imageNote} className="!bottom-auto top-3" />
            </div>
          </div>
          <div className="px-[var(--gutter)] py-16 md:py-24 lg:col-span-8 lg:px-20">
            <Eyebrow className="mb-4">02 — {c.start}</Eyebrow>
            <h2 id="request-title" className="sr-only">
              {c.start}
            </h2>
            <div className="max-w-3xl">
              <CustomRequestWizard />
            </div>
          </div>
        </div>
      </section>

      {/* Scope */}
      <section className="section" aria-label={dict.about.scopeTitle}>
        <div className="container-x grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {[images.kitchenWhite, images.bedroomHeadboard, images.tvDark, images.officeGreen].map((img, i) => (
            <div key={img.src} className="relative aspect-[3/4] overflow-hidden bg-stone" data-reveal="image" style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}>
              <div className="absolute inset-0">
                <Image src={img.src} alt={img.alt[locale]} fill sizes="(min-width:768px) 25vw, 50vw" className="object-cover" />
              </div>
            </div>
          ))}
        </div>
        <p className="container-x mt-3 text-xs text-mute">{dict.demo.imageNote}</p>
      </section>
    </>
  );
}
