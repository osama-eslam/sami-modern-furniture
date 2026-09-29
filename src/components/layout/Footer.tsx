import Link from "next/link";
import { business, primaryBranch } from "@/config/business";
import { categories } from "@/data/categories";
import { getDictionary } from "@/i18n/get-dictionary";
import { fmt, localePath } from "@/i18n/config";
import { formatPhone, formatTime } from "@/lib/format";
import { telLink, whatsappLink } from "@/lib/whatsapp";
import type { Locale } from "@/types/content";
import { Newsletter } from "../forms/Newsletter";
import { Icon } from "../ui/Icon";

export function SocialLinks({ className, size = 20 }: { className?: string; size?: number }) {
  const items = [
    ["instagram", business.social.instagram, "Instagram"],
    ["facebook", business.social.facebook, "Facebook"],
    ["tiktok", business.social.tiktok, "TikTok"],
    ["youtube", business.social.youtube, "YouTube"],
  ] as const;
  return (
    <ul className={className}>
      {items.map(([icon, url, label]) => (
        <li key={icon}>
          <a href={url} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid size-11 place-items-center border border-current/20 transition-colors hover:bg-ivory hover:text-charcoal">
            <Icon name={icon} size={size} />
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Footer({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const h = (p: string) => localePath(locale, p);
  const year = new Date().getFullYear();

  const cols = [
    {
      title: dict.footer.shop,
      links: [
        [h("/shop"), dict.nav.allProducts],
        [h("/shop/new-arrivals"), dict.nav.newArrivals],
        [h("/shop/best-sellers"), dict.nav.bestSellers],
        [h("/shop/offers"), dict.nav.offers],
        [h("/custom-furniture"), dict.nav.custom],
      ],
    },
    {
      title: dict.nav.categories,
      links: categories.slice(0, 8).map((c) => [h(`/categories/${c.slug}`), c.name[locale]]),
    },
    {
      title: dict.footer.service,
      links: [
        [h("/track-order"), dict.nav.trackOrder],
        [h("/account"), dict.nav.account],
        [h("/faq"), dict.nav.faq],
        [h("/shipping-policy"), dict.footer.shipping],
        [h("/returns-policy"), dict.footer.returns],
        [h("/contact"), dict.nav.contact],
      ],
    },
    {
      title: dict.footer.company,
      links: [
        [h("/about"), dict.nav.about],
        [h("/showroom"), dict.nav.showroom],
        [h("/inspiration"), dict.nav.inspiration],
        [h("/gallery"), dict.nav.gallery],
      ],
    },
  ];

  const weekdayHours = business.hours.find((x) => x.day === 1)!;
  const weekendHours = business.hours.find((x) => x.day === 5)!;

  return (
    <footer className="relative overflow-hidden bg-charcoal text-ivory on-dark pb-[var(--bottom-nav-h)]">
      <div className="container-x">
        {/* Newsletter band */}
        <div className="grid gap-10 border-b border-ivory/10 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="eyebrow text-ivory/50">SAMY MODERN / NEWSLETTER</p>
            <h2 className="font-display mt-5 text-h2 max-w-xl">{dict.newsletter.title}</h2>
            <p className="mt-4 max-w-md text-ivory/60">{dict.newsletter.body}</p>
          </div>
          <div className="flex items-end">
            <Newsletter tone="light" />
          </div>
        </div>

        {/* Link columns */}
        <div className="grid gap-12 py-16 md:grid-cols-12 md:py-20">
          <div className="md:col-span-4">
            <p className="font-display text-3xl leading-tight max-w-sm">{dict.footer.statement}</p>
            <div className="mt-10 space-y-5 text-sm text-ivory/70">
              <a href={primaryBranch.mapsUrl} target="_blank" rel="noopener noreferrer" className="flex gap-3 hover:text-ivory">
                <Icon name="pin" size={18} className="mt-0.5 shrink-0" />
                <span>
                  {primaryBranch.address[locale]}
                  <span className="mt-1 block text-xs text-ivory/40">{primaryBranch.landmark?.[locale]}</span>
                </span>
              </a>
              <div className="flex gap-3">
                <Icon name="clock" size={18} className="mt-0.5 shrink-0" />
                <span className="num">
                  {dict.showroom.days[6]} – {dict.showroom.days[4]}: {formatTime(weekdayHours.open, locale)} – {formatTime(weekdayHours.close, locale)}
                  <br />
                  {dict.showroom.days[5]} & {dict.showroom.days[0]}: {formatTime(weekendHours.open, locale)} – {formatTime(weekendHours.close, locale)}
                </span>
              </div>
              <a href={telLink(business.phones.primary)} className="flex gap-3 hover:text-ivory">
                <Icon name="phone" size={18} className="mt-0.5 shrink-0" />
                <span className="num" dir="ltr">{formatPhone(business.phones.primary)}</span>
              </a>
              <a href={`mailto:${business.emails.info}`} className="flex gap-3 hover:text-ivory">
                <Icon name="mail" size={18} className="mt-0.5 shrink-0" />
                <span dir="ltr">{business.emails.info}</span>
              </a>
            </div>
          </div>
          <nav className="grid grid-cols-2 gap-10 sm:grid-cols-4 md:col-span-8" aria-label="Footer">
            {cols.map((col) => (
              <div key={col.title}>
                <p className="eyebrow mb-6 text-ivory/40">{col.title}</p>
                <ul className="space-y-3 text-sm text-ivory/75">
                  {col.links.map(([href, label]) => (
                    <li key={href}>
                      <Link href={href} className="hover:text-ivory">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-6 border-t border-ivory/10 py-10 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-3">
            <a href={whatsappLink(dict.whatsappMessages.general)} target="_blank" rel="noopener noreferrer" className="btn btn-light btn-sm">
              <Icon name="whatsapp" size={16} /> {dict.nav.whatsapp}
            </a>
            <a href={primaryBranch.directionsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-light btn-sm">
              <Icon name="pin" size={16} /> {dict.common.getDirections}
            </a>
            <Link href={localePath(locale === "ar" ? "en" : "ar")} hrefLang={locale === "ar" ? "en" : "ar"} className="btn btn-ghost-light btn-sm">
              <Icon name="globe" size={16} /> {dict.nav.language}
            </Link>
          </div>
          <SocialLinks className="flex gap-2" />
        </div>
      </div>

      {/* Oversized wordmark */}
      <div className="pointer-events-none select-none overflow-hidden border-t border-ivory/10" aria-hidden>
        <p className="font-latin whitespace-nowrap px-[var(--gutter)] pt-6 text-center text-[15.5vw] font-extralight leading-[0.8] tracking-[-0.04em] text-ivory/[0.07]" dir="ltr">
          SAMY MODERN
        </p>
      </div>

      <div className="container-x flex flex-col gap-4 border-t border-ivory/10 py-6 text-xs text-ivory/45 md:flex-row md:items-center md:justify-between">
        <p>{fmt(dict.footer.rights, { year })}</p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          <li><Link href={h("/privacy")} className="hover:text-ivory">{dict.footer.privacy}</Link></li>
          <li><Link href={h("/terms")} className="hover:text-ivory">{dict.footer.terms}</Link></li>
          <li><Link href={h("/shipping-policy")} className="hover:text-ivory">{dict.footer.shipping}</Link></li>
          <li><Link href={h("/returns-policy")} className="hover:text-ivory">{dict.footer.returns}</Link></li>
        </ul>
        <p className="flex flex-wrap items-center gap-3">
          {dict.footer.directories}:
          <a href={business.directories.furniture1000} target="_blank" rel="noopener noreferrer" className="hover:text-ivory">Furniture1000</a>
          <a href={business.directories.yallahome} target="_blank" rel="noopener noreferrer" className="hover:text-ivory">YallaHome</a>
          <a href={business.directories.worldplaces} target="_blank" rel="noopener noreferrer" className="hover:text-ivory">WorldPlaces</a>
        </p>
      </div>
    </footer>
  );
}
