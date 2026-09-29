import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { business, primaryBranch } from "@/config/business";
import { images } from "@/data/demo/images";
import { isLocale, localePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { formatPhone } from "@/lib/format";
import { buildMetadata } from "@/lib/seo";
import { telLink, whatsappLink } from "@/lib/whatsapp";
import { HoursTable } from "@/components/content/HoursTable";
import { OpenStatus } from "@/components/home/client-bits";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow, IllustrativeTag, ImageHero, SectionHeading, SplitLines } from "@/components/ui/primitives";

export async function generateMetadata({ params }: PageProps<"/[locale]/showroom">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return buildMetadata({ locale, path: "/showroom", title: dict.showroom.title, description: `${dict.showroom.body} ${primaryBranch.address[locale]}` });
}

export default async function ShowroomPage({ params }: PageProps<"/[locale]/showroom">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const h = (p: string) => localePath(locale, p);
  const { lat, lng } = primaryBranch.geo;
  const mapSrc = `https://maps.google.com/maps?q=${lat},${lng}&z=16&hl=${locale}&output=embed`;
  const inside = [images.loft, images.livingChairs, images.consoleGold, images.bedroomHeadboard, images.diningSmall];

  return (
    <>
      <ImageHero
        eyebrow={dict.showroom.eyebrow}
        title={dict.showroom.title}
        body={dict.showroom.body}
        image={{ src: images.loft.src, alt: images.loft.alt[locale] }}
        imageNote={dict.demo.imageNote}
        breadcrumbs={[
          { name: dict.nav.home, href: h("/") },
          { name: dict.nav.showroom, href: h("/showroom") },
        ]}
      >
        <div className="flex flex-wrap gap-3">
          <a href={primaryBranch.directionsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-light">
            <Icon name="pin" size={16} /> {dict.common.getDirections}
          </a>
          <a href={whatsappLink(dict.whatsappMessages.general)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-light">
            <Icon name="whatsapp" size={18} /> {dict.showroom.visitCta}
          </a>
        </div>
      </ImageHero>

      {/* Visit essentials */}
      <section className="section" aria-labelledby="visit-title">
        <div className="container-x grid gap-16 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <Eyebrow className="mb-5">01 — {primaryBranch.name[locale]}</Eyebrow>
            <h2 id="visit-title" className="font-display text-h1">
              <SplitLines lines={[dict.home.showroomTitle]} as="p" />
            </h2>
            <dl className="mt-12 divide-y hairline border-y hairline text-sm">
              <div className="grid gap-2 py-5 sm:grid-cols-3 sm:gap-4">
                <dt className="text-mute">{dict.showroom.address}</dt>
                <dd className="sm:col-span-2">
                  <span className="text-base">{primaryBranch.address[locale]}</span>
                  <span className="mt-1.5 block text-xs text-mute">
                    {dict.showroom.landmark}: {primaryBranch.landmark[locale]}
                  </span>
                </dd>
              </div>
              <div className="grid gap-2 py-5 sm:grid-cols-3 sm:gap-4">
                <dt className="text-mute">{dict.showroom.phone}</dt>
                <dd className="flex flex-col gap-1.5 sm:col-span-2">
                  {[business.phones.primary, business.phones.landline].map((p) => (
                    <a key={p} href={telLink(p)} className="num w-fit text-base hover:underline underline-offset-4" dir="ltr">
                      {formatPhone(p)}
                    </a>
                  ))}
                </dd>
              </div>
              <div className="grid gap-2 py-5 sm:grid-cols-3 sm:gap-4">
                <dt className="text-mute">{dict.showroom.hours}</dt>
                <dd className="sm:col-span-2">
                  <OpenStatus className="mb-2 text-sm" />
                  <HoursTable />
                </dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-7">
            <div className="relative aspect-[4/5] overflow-hidden bg-stone sm:aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[640px]">
              <iframe
                title={`${dict.showroom.mapTitle} — ${primaryBranch.name[locale]}`}
                src={mapSrc}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 size-full border-0 grayscale-[0.85] contrast-[1.05]"
                allowFullScreen
              />
              <a
                href={primaryBranch.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm absolute bottom-4 start-4"
              >
                <Icon name="pin" size={15} /> {dict.common.openMap}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Inside the showroom */}
      <section className="section bg-paper" aria-labelledby="inside-title">
        <div className="container-x">
          <SectionHeading eyebrow="02 — SAMY MODERN" title={dict.showroom.gallery} action={{ href: h("/gallery"), label: dict.nav.gallery }} />
          <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-6 md:gap-4">
            {inside.map((img, i) => (
              <div
                key={img.src}
                className={
                  i === 0
                    ? "relative col-span-2 aspect-[4/3] overflow-hidden bg-stone md:col-span-4 md:row-span-2 md:aspect-auto"
                    : i < 3
                      ? "relative aspect-square overflow-hidden bg-stone md:col-span-2"
                      : "relative aspect-[4/3] overflow-hidden bg-stone md:col-span-3"
                }
                data-reveal="image"
                style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
              >
                <div className="absolute inset-0">
                  <Image src={img.src} alt={img.alt[locale]} fill sizes={i === 0 ? "(min-width:768px) 66vw, 100vw" : "(min-width:768px) 33vw, 50vw"} className="object-cover" />
                </div>
                {i === 0 && <IllustrativeTag label={dict.demo.imageNote} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Branches */}
      <section className="section" aria-labelledby="branches-title">
        <div className="container-x">
          <SectionHeading eyebrow="03 — ALEXANDRIA" title={dict.showroom.branches} />
          <ul className="mt-14 grid gap-px bg-line md:grid-cols-2">
            {business.branches.map((b, i) => (
              <li key={b.id} className="flex flex-col bg-ivory p-7 md:p-10">
                <span className="num text-xs text-taupe">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-display mt-4 text-h3">{b.name[locale]}</h3>
                <p className="mt-4 max-w-sm leading-relaxed text-ink">{b.address[locale]}</p>
                {b.landmark && <p className="mt-2 text-sm text-mute">{b.landmark[locale]}</p>}
                <div className="mt-auto flex flex-wrap gap-3 pt-8">
                  <a href={b.directionsUrl ?? b.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                    <Icon name="pin" size={15} /> {dict.common.getDirections}
                  </a>
                  {b.primary && (
                    <a href={telLink(business.phones.primary)} className="btn btn-outline btn-sm">
                      <Icon name="phone" size={15} /> {dict.common.callUs}
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-walnut text-ivory on-dark">
        <div className="container-x grid gap-10 py-20 md:grid-cols-12 md:items-end md:py-28">
          <div className="md:col-span-7">
            <p className="eyebrow mb-5 text-ivory/55">{dict.home.customEyebrow}</p>
            <h2 className="font-display text-h1">{dict.home.customTitle}</h2>
          </div>
          <div className="flex flex-wrap gap-3 md:col-span-5 md:justify-end">
            <Link href={h("/custom-furniture")} className="btn btn-light">
              {dict.home.customCta} <Icon name="arrow" size={16} className="flip-rtl" />
            </Link>
            <Link href={h("/shop")} className="btn btn-ghost-light">
              {dict.home.heroCta}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
