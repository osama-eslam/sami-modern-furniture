import Image from "next/image";
import Link from "next/link";
import { primaryBranch } from "@/config/business";
import { images } from "@/data/demo/images";
import type { Dictionary } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/config";
import type { Locale } from "@/types/content";
import { Magnetic } from "../layout/effects";
import { Icon } from "../ui/Icon";
import { IllustrativeTag } from "../ui/primitives";
import { Parallax } from "./client-bits";

export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const h = (p: string) => localePath(locale, p);
  const title = dict.home.heroTitle.split(" ");
  // Two balanced lines for the oversized headline.
  const mid = Math.ceil(title.length / 2);
  const lines = [title.slice(0, mid).join(" "), title.slice(mid).join(" ")];

  return (
    <section className="relative h-[100svh] min-h-[620px] overflow-hidden bg-charcoal text-ivory on-dark grain" aria-labelledby="hero-title">
      <Parallax speed={0.18} className="absolute inset-0 -top-[8%] h-[116%]">
        <div className="ken-burns absolute inset-0">
          <Image src={images.heroLiving.src} alt={images.heroLiving.alt[locale]} fill priority fetchPriority="high" quality={75} sizes="100vw" className="object-cover" />
        </div>
      </Parallax>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,23,23,.55)_0%,rgba(23,23,23,.1)_35%,rgba(23,23,23,.25)_60%,rgba(23,23,23,.8)_100%)]" />

      <div className="container-x relative flex h-full flex-col justify-end pb-[calc(var(--bottom-nav-h)+2.5rem)] pt-[calc(var(--header-h)+var(--notice-h))] md:pb-16">
        <div className="mb-auto flex items-start justify-between pt-10 md:pt-14">
          <p className="eyebrow hero-fade text-ivory/70" style={{ "--line-delay": "900ms" } as React.CSSProperties}>
            SAMY MODERN / COLLECTION 01
          </p>
          <p className="hero-fade hidden text-end text-xs leading-relaxed text-ivory/70 md:block" style={{ "--line-delay": "1000ms" } as React.CSSProperties}>
            {primaryBranch.name[locale]}
            <br />
            {primaryBranch.address[locale]}
          </p>
        </div>

        {locale === "en" ? (
          <p className="hero-fade font-display-ar mb-4 text-xl text-ivory/80 md:text-2xl" style={{ "--line-delay": "1000ms" } as React.CSSProperties} lang="ar" dir="rtl">
            سامي مودرن
          </p>
        ) : (
          <p className="hero-fade eyebrow font-latin mb-5 !tracking-[0.4em] text-ivory/80" style={{ "--line-delay": "1000ms" } as React.CSSProperties} lang="en" dir="ltr">
            SAMY MODERN
          </p>
        )}
        <h1 id="hero-title" className="font-display text-hero max-w-[14ch]">
          {lines.map((line, i) => (
            <span key={i} className="mask-line hero-line" style={{ "--line-delay": `${1050 + i * 130}ms` } as React.CSSProperties}>
              <span>{line}</span>
            </span>
          ))}
        </h1>

        <div className="mt-10 flex flex-col gap-8 md:mt-14 md:flex-row md:items-end md:justify-between">
          <p className="hero-fade max-w-md text-[0.95rem] leading-relaxed text-ivory/80" style={{ "--line-delay": "1400ms" } as React.CSSProperties}>
            {dict.home.heroSubtitle}
          </p>
          <div className="hero-fade flex flex-wrap gap-3" style={{ "--line-delay": "1500ms" } as React.CSSProperties}>
            <Magnetic>
              <Link href={h("/shop")} className="btn btn-light">
                {dict.home.heroCta}
                <Icon name="arrow" size={16} className="flip-rtl" />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link href={h("/showroom")} className="btn btn-ghost-light">
                {dict.home.heroCta2}
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-0 start-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 pb-6 md:flex rtl:translate-x-1/2" aria-hidden>
        <span className="eyebrow text-[10px] text-ivory/60">{dict.home.scroll}</span>
        <span className="block h-12 w-px overflow-hidden bg-ivory/20">
          <span className="block h-full w-full bg-ivory" style={{ animation: "scroll-line 2.4s cubic-bezier(.83,0,.17,1) infinite" }} />
        </span>
      </div>
      <IllustrativeTag label={dict.demo.imageNote} className="!bottom-[calc(var(--bottom-nav-h)+0.75rem)] md:!bottom-3" />
    </section>
  );
}
