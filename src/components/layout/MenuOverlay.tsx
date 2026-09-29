"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { business } from "@/config/business";
import { categories } from "@/data/categories";
import { useI18n } from "@/i18n/provider";
import { formatPhone } from "@/lib/format";
import { whatsappLink, telLink } from "@/lib/whatsapp";
import { ui } from "@/store/stores";
import { Icon } from "../ui/Icon";
import { Logo } from "../ui/primitives";
import { switchLocalePath } from "./Header";
import { useDialog } from "./useDialog";

export function MenuOverlay() {
  const { dict, href, locale } = useI18n();
  const pathname = usePathname();
  const { menuOpen } = ui.use();
  const close = () => ui.set((u) => ({ ...u, menuOpen: false }));
  const ref = useDialog<HTMLDivElement>(menuOpen, close);

  const primary = [
    ["/", dict.nav.home],
    ["/shop", dict.nav.shop],
    ["/custom-furniture", dict.nav.custom],
    ["/showroom", dict.nav.showroom],
    ["/about", dict.nav.about],
    ["/inspiration", dict.nav.inspiration],
    ["/gallery", dict.nav.gallery],
    ["/contact", dict.nav.contact],
  ];

  return (
    <>
      <div className="overlay-backdrop" data-open={menuOpen} onClick={close} aria-hidden />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={dict.nav.menu}
        className="drawer !w-full sm:!w-[560px] bg-charcoal text-ivory on-dark"
        data-side="start"
        data-open={menuOpen}
      >
        <div className="flex h-[var(--header-h)] shrink-0 items-center justify-between px-[var(--gutter)] border-b border-ivory/10">
          <Logo tone="light" compact />
          <button type="button" onClick={close} className="grid size-10 place-items-center -me-2" aria-label={dict.nav.close}>
            <Icon name="close" size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-[var(--gutter)] py-8">
          <nav aria-label={dict.nav.menu}>
            <ol className="flex flex-col">
              {primary.map(([h, label], i) => (
                <li key={h} className="border-b border-ivory/10">
                  <Link href={href(h)} className="group flex items-baseline gap-5 py-4">
                    <span className="num text-[11px] text-ivory/40">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-display text-[2rem] leading-none transition-transform duration-500 group-hover:translate-x-2 rtl:group-hover:-translate-x-2">{label}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
          <p className="eyebrow mt-10 mb-4 text-ivory/50">{dict.nav.categories}</p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-[0.95rem] text-ivory/80">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={href(`/categories/${c.slug}`)} className="hover:text-ivory">
                  {c.name[locale]}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 grid grid-cols-2 gap-3 text-sm">
            <Link href={href("/track-order")} className="btn btn-ghost-light btn-sm">{dict.nav.trackOrder}</Link>
            <Link href={href("/account")} className="btn btn-ghost-light btn-sm">{dict.nav.account}</Link>
            <Link href={href("/compare")} className="btn btn-ghost-light btn-sm">{dict.nav.compare}</Link>
            <Link href={switchLocalePath(pathname, locale === "ar" ? "en" : "ar")} hrefLang={locale === "ar" ? "en" : "ar"} className="btn btn-ghost-light btn-sm">
              <Icon name="globe" size={16} /> {dict.nav.language}
            </Link>
          </div>
        </div>
        <div className="shrink-0 border-t border-ivory/10 px-[var(--gutter)] py-5 flex items-center justify-between gap-4 text-sm">
          <a href={telLink(business.phones.primary)} className="num text-ivory/80" dir="ltr">{formatPhone(business.phones.primary)}</a>
          <a href={whatsappLink(dict.whatsappMessages.general)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
            <Icon name="whatsapp" size={18} /> {dict.nav.whatsapp}
          </a>
        </div>
      </div>
    </>
  );
}
