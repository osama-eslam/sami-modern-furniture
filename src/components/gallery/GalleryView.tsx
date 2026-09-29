"use client";

import Image from "next/image";
import { useState } from "react";
import { beforeAfterPairs, galleryItems } from "@/data/content/gallery";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";
import type { GalleryCategory } from "@/types/content";
import { Icon } from "../ui/Icon";
import { BeforeAfter } from "./BeforeAfter";
import { Lightbox } from "./Lightbox";

type Filter = "all" | GalleryCategory | "before-after";

export function GalleryView() {
  const { dict, t } = useI18n();
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<number | null>(null);

  const present = new Set(galleryItems.map((g) => g.category));
  const filters = (Object.keys(dict.gallery.filters) as Filter[]).filter((f) => f === "all" || f === "before-after" || present.has(f as GalleryCategory));
  const items = filter === "all" ? galleryItems : galleryItems.filter((g) => g.category === filter);
  const lightbox = items.map((g) => ({ src: g.image.src, alt: t(g.image.alt), caption: t(g.caption) }));

  return (
    <>
      <div className="sticky top-[calc(var(--header-h)-1px)] z-20 border-y hairline bg-ivory/90 backdrop-blur-lg">
        <div className="container-x">
          <ul className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto py-3" role="tablist" aria-label={dict.gallery.title}>
            {filters.map((f) => (
              <li key={f} className="shrink-0">
                <button
                  type="button"
                  role="tab"
                  aria-selected={filter === f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "h-10 whitespace-nowrap px-4 text-sm transition-colors duration-500",
                    filter === f ? "bg-charcoal text-ivory" : "text-mute hover:text-charcoal",
                  )}
                >
                  {dict.gallery.filters[f]}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container-x py-12 md:py-16" role="tabpanel">
        {filter === "before-after" ? (
          <div className="space-y-16">
            {beforeAfterPairs.map((p) => (
              <figure key={p.id} className="mx-auto max-w-5xl">
                <BeforeAfter before={p.before} after={p.after} />
                <figcaption className="mt-4 flex items-center justify-between gap-4 text-sm text-mute">
                  <span>{t(p.caption)}</span>
                  <span className="hidden items-center gap-2 text-xs sm:flex">
                    <Icon name="compare" size={14} /> {dict.gallery.drag}
                  </span>
                </figcaption>
              </figure>
            ))}
            <p className="mx-auto max-w-5xl border-s-2 border-bronze ps-4 text-sm text-mute">{dict.home.beforeAfterNote}</p>
          </div>
        ) : (
          <ul key={filter} className="columns-2 gap-3 md:columns-3 md:gap-4 xl:columns-4">
            {items.map((g, i) => (
              <li key={g.id} className="mb-3 break-inside-avoid md:mb-4" style={{ animation: `fade-up .9s cubic-bezier(.16,1,.3,1) ${Math.min(i, 10) * 50}ms both` }}>
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  className={cn(
                    "group relative block w-full overflow-hidden bg-stone text-start",
                    g.ratio === "portrait" ? "aspect-[3/4]" : g.ratio === "landscape" ? "aspect-[4/3]" : "aspect-square",
                  )}
                  aria-label={`${t(g.caption)} — ${dict.product.fullscreen}`}
                >
                  <Image src={g.image.src} alt={t(g.image.alt)} fill sizes="(min-width:1280px) 25vw, (min-width:768px) 33vw, 50vw" className="zoom-on-hover object-cover" />
                  <span className="absolute inset-0 bg-gradient-to-t from-charcoal/65 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100" />
                  <span className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 text-ivory opacity-0 transition-all duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 translate-y-2 group-hover:translate-y-0">
                    <span className="text-sm">{t(g.caption)}</span>
                    <Icon name="expand" size={18} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-10 text-xs text-mute">{dict.demo.imageNote}</p>
      </div>

      <Lightbox items={lightbox} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
    </>
  );
}
