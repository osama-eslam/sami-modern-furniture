import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/types/content";
import { formatPrice } from "@/lib/format";
import { breadcrumbJsonLd } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

/* ---------------------------------------------------------------- Logo */

export function Logo({ tone = "dark", className, compact }: { tone?: "dark" | "light"; className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)} dir="ltr">
      {/* Brand mark from the existing Samy Modern identity (white line drawing). */}
      <Image
        src="/brand-mark.png"
        alt=""
        width={198}
        height={474}
        className={cn("h-9 w-auto shrink-0", tone === "dark" && "invert")}
        priority
      />
      <span className="flex flex-col leading-none">
        <span className="font-latin text-[0.95rem] font-medium tracking-[0.34em]">SAMY MODERN</span>
        {!compact && (
          <span className="mt-1.5 font-display-ar text-[0.7rem] tracking-normal opacity-70">سامي مودرن للأثاث</span>
        )}
      </span>
    </span>
  );
}

/* ------------------------------------------------------- Text helpers */

export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

/** Headline split into masked lines that slide up when revealed. */
export function SplitLines({ lines, as: Tag = "h2", className, hero, baseDelay = 0 }: { lines: string[]; as?: "h1" | "h2" | "h3" | "p"; className?: string; hero?: boolean; baseDelay?: number }) {
  return (
    <Tag className={className} data-reveal={hero ? undefined : "lines"}>
      {lines.map((line, i) => (
        <span key={i} className={cn("mask-line", hero && "hero-line")} style={{ "--line-delay": `${baseDelay + i * 110}ms` } as React.CSSProperties}>
          <span>{line}</span>
        </span>
      ))}
    </Tag>
  );
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("eyebrow text-mute", className)}>{children}</p>;
}

export function SectionHeading({
  eyebrow,
  title,
  action,
  className,
  tone = "dark",
}: {
  eyebrow?: string;
  title: string;
  action?: { href: string; label: string };
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <div className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-3xl">
        {eyebrow && <Eyebrow className={cn("mb-5", tone === "light" && "text-ivory/60")}>{eyebrow}</Eyebrow>}
        <SplitLines lines={[title]} className="font-display text-h2" />
      </div>
      {action && (
        <Link href={action.href} className={cn("link-line label shrink-0", tone === "light" ? "text-ivory" : "text-charcoal")}>
          {action.label}
          <Icon name="arrow" size={16} className="flip-rtl" />
        </Link>
      )}
    </div>
  );
}

/* ---------------------------------------------------------- Commerce */

export function Price({ amount, compareAt, locale, className, size = "md" }: { amount: number; compareAt?: number; locale: Locale; className?: string; size?: "sm" | "md" | "lg" }) {
  return (
    <span className={cn("inline-flex flex-wrap items-baseline gap-x-3 gap-y-1", className)}>
      <span className={cn("num font-medium", size === "lg" && "text-2xl md:text-3xl font-light", size === "sm" && "text-sm")}>{formatPrice(amount, locale)}</span>
      {compareAt && compareAt > amount && (
        <s className={cn("num text-mute", size === "lg" ? "text-base" : "text-xs")} aria-label={locale === "ar" ? `السعر السابق ${formatPrice(compareAt, locale)}` : `Was ${formatPrice(compareAt, locale)}`}>
          {formatPrice(compareAt, locale)}
        </s>
      )}
    </span>
  );
}

/* -------------------------------------------------------- Navigation */

export function Breadcrumbs({ items, className, tone = "dark" }: { items: { name: string; href: string }[]; className?: string; tone?: "dark" | "light" }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-xs", className)}>
      <JsonLd data={breadcrumbJsonLd(items.map((i) => ({ name: i.name, path: i.href })))} />
      <ol className={cn("flex flex-wrap items-center gap-2", tone === "light" ? "text-ivory/70" : "text-mute")}>
        {items.map((item, i) => (
          <li key={item.href} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden className="opacity-50">/</span>}
            {i === items.length - 1 ? (
              <span aria-current="page" className={tone === "light" ? "text-ivory" : "text-charcoal"}>
                {item.name}
              </span>
            ) : (
              <Link href={item.href} className="hover:opacity-100 hover:underline underline-offset-4">
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ---------------------------------------------------------- Accordion */

export function Accordion({ items, className, defaultOpen = -1, name }: { items: { title: React.ReactNode; content: React.ReactNode }[]; className?: string; defaultOpen?: number; name?: string }) {
  return (
    <div className={cn("border-t hairline", className)}>
      {items.map((item, i) => (
        <details key={i} className="accordion border-b hairline" open={i === defaultOpen} name={name}>
          <summary className="flex items-center justify-between gap-6 py-5 text-start">
            <span className="text-[0.95rem] font-medium">{item.title}</span>
            <Icon name="plus" size={18} className="acc-icon shrink-0" />
          </summary>
          <div className="acc-body">
            <div className="overflow-hidden">
              <div className="pb-6 text-[0.95rem] leading-relaxed text-ink">{item.content}</div>
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}

/* ----------------------------------------------------------- Page hero */

export function PageHeader({
  eyebrow,
  title,
  body,
  breadcrumbs,
  children,
  className,
}: {
  eyebrow: string;
  title: string;
  body?: string;
  breadcrumbs?: { name: string; href: string }[];
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("container-x pt-[calc(var(--header-h)+var(--notice-h)+2.5rem)] pb-12 md:pt-[calc(var(--header-h)+var(--notice-h)+4.5rem)] md:pb-16", className)}>
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} className="mb-10" />}
      <Eyebrow className="mb-6 hero-fade">{eyebrow}</Eyebrow>
      <SplitLines lines={[title]} as="h1" hero className="font-display text-h1 max-w-5xl" baseDelay={80} />
      {body && (
        <p className="lead mt-8 max-w-2xl hero-fade" style={{ "--line-delay": "250ms" } as React.CSSProperties}>
          {body}
        </p>
      )}
      {children}
    </header>
  );
}

export function IllustrativeTag({ label, className }: { label: string; className?: string }) {
  return (
    <span className={cn("pointer-events-none absolute bottom-3 end-3 z-[2] bg-charcoal/55 px-2 py-1 text-[10px] tracking-wide text-ivory/90 backdrop-blur-sm", className)}>
      {label}
    </span>
  );
}

/* ---------------------------------------------------- Full-bleed hero */

/** Image hero for routes where the header starts transparent (see Header OVERLAY_ROUTES). */
export function ImageHero({
  eyebrow,
  title,
  body,
  image,
  imageNote,
  breadcrumbs,
  children,
}: {
  eyebrow: string;
  title: string;
  body?: string;
  image: { src: string; alt: string };
  imageNote?: string;
  breadcrumbs?: { name: string; href: string }[];
  children?: React.ReactNode;
}) {
  return (
    <section className="relative flex min-h-[88svh] items-end overflow-hidden bg-charcoal text-ivory on-dark grain md:min-h-[92svh]">
      <div className="ken-burns absolute inset-0">
        <Image src={image.src} alt={image.alt} fill priority fetchPriority="high" quality={75} sizes="100vw" className="object-cover" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,23,23,.6)_0%,rgba(23,23,23,.15)_35%,rgba(23,23,23,.35)_65%,rgba(23,23,23,.85)_100%)]" />
      <div className="container-x relative pb-14 pt-[calc(var(--header-h)+var(--notice-h)+3rem)] md:pb-20">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} tone="light" className="mb-10 hero-fade" />}
        <Eyebrow className="hero-fade mb-6 !text-ivory/65">{eyebrow}</Eyebrow>
        <SplitLines lines={[title]} as="h1" hero className="font-display text-mega max-w-[18ch]" baseDelay={120} />
        {body && (
          <p className="hero-fade mt-8 max-w-xl text-[1.05rem] leading-relaxed text-ivory/80 md:text-lg" style={{ "--line-delay": "350ms" } as React.CSSProperties}>
            {body}
          </p>
        )}
        {children && (
          <div className="hero-fade mt-10" style={{ "--line-delay": "480ms" } as React.CSSProperties}>
            {children}
          </div>
        )}
      </div>
      {imageNote && <IllustrativeTag label={imageNote} />}
    </section>
  );
}

/* ------------------------------------------------------- Empty state */

export function EmptyState({ title, body, action, icon = "bag" }: { title: string; body?: string; action?: { href: string; label: string }; icon?: React.ComponentProps<typeof Icon>["name"] }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-start justify-center gap-6 border-t hairline py-20">
      <span className="grid size-16 place-items-center border hairline text-mute">
        <Icon name={icon} size={26} />
      </span>
      <p className="font-display text-h2 max-w-xl">{title}</p>
      {body && <p className="lead max-w-lg">{body}</p>}
      {action && (
        <Link href={action.href} className="btn btn-primary">
          {action.label} <Icon name="arrow" size={16} className="flip-rtl" />
        </Link>
      )}
    </div>
  );
}
