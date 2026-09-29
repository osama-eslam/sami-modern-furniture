"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { business } from "@/config/business";
import { categories } from "@/data/categories";
import { useI18n } from "@/i18n/provider";
import { whatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { cartStore, ui, wishlistStore } from "@/store/stores";
import { Icon } from "../ui/Icon";
import { Logo } from "../ui/primitives";

/** Routes whose first screen is a full-bleed image: header starts transparent. */
const OVERLAY_ROUTES = ["", "/about", "/showroom", "/custom-furniture"];

export const switchLocalePath = (pathname: string, to: string) => pathname.replace(/^\/(ar|en)(?=\/|$)/, `/${to}`);

export function Header({ notice }: { notice?: string }) {
  const { dict, href, locale } = useI18n();
  const pathname = usePathname();
  const rest = pathname.replace(/^\/(ar|en)/, "");
  const overlayRoute = OVERLAY_ROUTES.includes(rest);
  const [scrolled, setScrolled] = useState(false);
  const [mega, setMega] = useState(false);
  const megaTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const { lines } = cartStore.use();
  const { ids: wish } = wishlistStore.use();
  const count = lines.reduce((n, l) => n + l.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mega menu on navigation (state adjusted during render, no effect needed).
  const [megaPath, setMegaPath] = useState(pathname);
  if (megaPath !== pathname) {
    setMegaPath(pathname);
    setMega(false);
  }

  const transparent = overlayRoute && !scrolled && !mega;
  const tone = transparent ? "light" : "dark";

  const links = [
    { href: "/shop", label: dict.nav.products },
    { href: "/custom-furniture", label: dict.nav.custom },
    { href: "/about", label: dict.nav.about },
    { href: "/showroom", label: dict.nav.showroom },
    { href: "/inspiration", label: dict.nav.inspiration },
    { href: "/contact", label: dict.nav.contact },
  ];

  const openMega = () => {
    clearTimeout(megaTimer.current);
    setMega(true);
  };
  const closeMega = () => {
    megaTimer.current = setTimeout(() => setMega(false), 120);
  };

  const iconBtn = "grid size-10 place-items-center transition-opacity hover:opacity-60 relative";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[70] transition-[background-color,color,border-color,backdrop-filter] duration-700",
        transparent ? "border-b border-transparent bg-transparent text-ivory on-dark" : "border-b hairline bg-ivory/85 text-charcoal backdrop-blur-xl",
      )}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-10 focus:bg-charcoal focus:px-4 focus:py-2 focus:text-ivory">
        {dict.nav.skip}
      </a>
      {notice && (
        <div className={cn("grid overflow-hidden bg-charcoal text-ivory/80 transition-[grid-template-rows] duration-500", scrolled ? "grid-rows-[0fr]" : "grid-rows-[1fr]")}>
          <p className="min-h-0 truncate px-4 text-center text-[11px] leading-[var(--notice-h)]">{notice}</p>
        </div>
      )}
      <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-6">
        {/* Start: menu (mobile) / logo */}
        <div className="flex items-center gap-2 xl:gap-0">
          <button type="button" className={cn(iconBtn, "-ms-2 xl:hidden")} aria-label={dict.nav.menu} onClick={() => ui.set((u) => ({ ...u, menuOpen: true }))}>
            <Icon name="menu" size={24} />
          </button>
          <Link href={href("/")} aria-label={dict.meta.siteName} className="hidden xl:block">
            <Logo tone={tone} />
          </Link>
        </div>

        <Link href={href("/")} aria-label={dict.meta.siteName} className="absolute start-1/2 -translate-x-1/2 rtl:translate-x-1/2 xl:hidden">
          <Logo tone={tone} compact />
        </Link>

        {/* Center: primary navigation */}
        <nav aria-label="Primary" className="hidden xl:block">
          <ul className="flex items-center gap-7 text-[0.8125rem] font-medium tracking-wide">
            <li onMouseEnter={openMega} onMouseLeave={closeMega}>
              <button
                type="button"
                className="nav-link flex items-center gap-1"
                aria-expanded={mega}
                aria-controls="mega-menu"
                onClick={() => setMega((m) => !m)}
                onFocus={openMega}
              >
                {dict.nav.collections}
                <Icon name="chevronDown" size={14} className={cn("transition-transform duration-500", mega && "rotate-180")} />
              </button>
            </li>
            {links.map((l) => (
              <li key={l.href}>
                <Link href={href(l.href)} className="nav-link" aria-current={rest.startsWith(l.href) ? "page" : undefined}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* End: utilities */}
        <div className="flex items-center gap-0.5">
          <button type="button" className={cn(iconBtn, "hidden lg:grid")} aria-label={dict.nav.search} onClick={() => ui.set((u) => ({ ...u, searchOpen: true }))}>
            <Icon name="search" />
          </button>
          <Link href={href("/account")} className={cn(iconBtn, "hidden lg:grid")} aria-label={dict.nav.account}>
            <Icon name="user" />
          </Link>
          <Link href={href("/wishlist")} className={cn(iconBtn, "hidden lg:grid")} aria-label={`${dict.nav.wishlist} (${wish.length})`}>
            <Icon name="heart" />
            {wish.length > 0 && <Badge n={wish.length} light={transparent} />}
          </Link>
          <button type="button" className={cn(iconBtn, "hidden lg:grid")} aria-label={`${dict.nav.cart} (${count})`} onClick={() => ui.set((u) => ({ ...u, cartOpen: true }))}>
            <Icon name="bag" />
            {count > 0 && <Badge n={count} light={transparent} />}
          </button>
          <Link
            href={switchLocalePath(pathname, locale === "ar" ? "en" : "ar")}
            hrefLang={locale === "ar" ? "en" : "ar"}
            className={cn(iconBtn, "hidden w-auto px-2 text-xs font-medium tracking-widest lg:grid")}
            aria-label={dict.nav.language}
          >
            {dict.nav.languageShort}
          </Link>
          <a
            href={whatsappLink(dict.whatsappMessages.general)}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(iconBtn, "-me-2 lg:me-0")}
            aria-label={`${dict.nav.whatsapp} ${business.phones.primary}`}
          >
            <Icon name="whatsapp" size={21} />
          </a>
        </div>
      </div>

      {/* Mega menu */}
      <div
        id="mega-menu"
        onMouseEnter={openMega}
        onMouseLeave={closeMega}
        className={cn(
          "absolute inset-x-0 top-full hidden border-b hairline bg-ivory text-charcoal xl:block transition-[opacity,transform,visibility] duration-500",
          mega ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0",
        )}
      >
        <div className="container-x grid grid-cols-12 gap-10 py-12">
          <div className="col-span-3 flex flex-col gap-4 border-e hairline pe-10">
            <p className="eyebrow text-mute">{dict.nav.shop}</p>
            {[
              ["/shop", dict.nav.allProducts],
              ["/shop/new-arrivals", dict.nav.newArrivals],
              ["/shop/best-sellers", dict.nav.bestSellers],
              ["/shop/offers", dict.nav.offers],
              ["/categories", dict.nav.categories],
            ].map(([h, l]) => (
              <Link key={h} href={href(h)} className="font-display text-2xl hover:text-wood transition-colors">
                {l}
              </Link>
            ))}
          </div>
          <ul className="col-span-5 grid grid-cols-2 content-start gap-x-8 gap-y-3">
            {categories.map((c, i) => (
              <li key={c.slug}>
                <Link href={href(`/categories/${c.slug}`)} className="group flex items-baseline gap-3 py-1 text-[0.95rem]">
                  <span className="num text-[10px] text-taupe">{String(i + 1).padStart(2, "0")}</span>
                  <span className="transition-transform duration-500 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">{c.name[locale]}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href={href("/custom-furniture")} className="group relative col-span-4 block aspect-[4/3] overflow-hidden bg-stone">
            <Image src={categories[1].image.src} alt="" fill sizes="30vw" className="zoom-on-hover object-cover" />
            <span className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent" />
            <span className="absolute bottom-6 start-6 end-6 text-ivory">
              <span className="eyebrow block text-ivory/70">{dict.home.customEyebrow}</span>
              <span className="font-display mt-2 block text-2xl">{dict.nav.custom}</span>
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}

function Badge({ n, light }: { n: number; light?: boolean }) {
  return (
    <span
      key={n}
      className={cn(
        "heart-pop num absolute end-0.5 top-0.5 grid min-w-4 h-4 place-items-center rounded-full px-1 text-[9px] font-semibold",
        light ? "bg-ivory text-charcoal" : "bg-charcoal text-ivory",
      )}
    >
      {n}
    </span>
  );
}
