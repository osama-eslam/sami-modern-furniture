"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/provider";
import { fmt } from "@/i18n/config";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/commerce";
import { Lightbox } from "../gallery/Lightbox";
import { Icon } from "../ui/Icon";
import { IllustrativeTag } from "../ui/primitives";

/**
 * Product gallery: native scroll-snap swipe on touch, arrow/thumbnail/keyboard
 * navigation, fullscreen + zoom via Lightbox, optional video slide.
 * Architecture note: `product.spin360` frames can be added as another slide type.
 */
export function ProductGallery({ product, index, onIndex }: { product: Product; index: number; onIndex: (i: number) => void }) {
  const { dict, t } = useI18n();
  const track = useRef<HTMLDivElement>(null);
  const slides = useRef<(HTMLDivElement | null)[]>([]);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const fromScroll = useRef(false);
  const images = product.images;
  const total = images.length + (product.video ? 1 : 0);

  // Track which slide is visible (works in LTR & RTL).
  useEffect(() => {
    const root = track.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio > 0.6) {
            const i = Number((e.target as HTMLElement).dataset.index);
            fromScroll.current = true;
            onIndex(i);
          }
        }
      },
      { root, threshold: [0.6] },
    );
    slides.current.forEach((s) => s && io.observe(s));
    return () => io.disconnect();
  }, [onIndex, total]);

  // Scroll to the active slide when it changes from outside (thumbnails, variants).
  useEffect(() => {
    if (fromScroll.current) {
      fromScroll.current = false;
      return;
    }
    const el = slides.current[index];
    const root = track.current;
    if (!el || !root) return;
    // Visual delta works identically in LTR and RTL and never scrolls the page.
    const delta = el.getBoundingClientRect().left - root.getBoundingClientRect().left;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.scrollBy({ left: delta, behavior: reduce ? "auto" : "smooth" });
  }, [index]);

  const go = (delta: number) => onIndex((index + delta + total) % total);

  return (
    <div className="flex flex-col-reverse gap-4 lg:flex-row lg:items-start" role="region" aria-roledescription="carousel" aria-label={t(product.name)}>
      {/* Thumbnails */}
      <ul className="no-scrollbar flex gap-2 overflow-x-auto lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:w-20 lg:flex-col lg:overflow-visible">
        {images.map((img, i) => (
          <li key={img.src} className="shrink-0">
            <button
              type="button"
              onClick={() => onIndex(i)}
              aria-label={fmt(dict.product.imageOf, { n: i + 1, total })}
              aria-current={i === index}
              className={cn("relative block h-20 w-16 overflow-hidden bg-stone transition-opacity lg:h-24 lg:w-20", i === index ? "opacity-100 ring-1 ring-charcoal ring-offset-2 ring-offset-ivory" : "opacity-55 hover:opacity-100")}
            >
              <Image src={img.src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          </li>
        ))}
        {product.video && (
          <li className="shrink-0">
            <button type="button" onClick={() => onIndex(images.length)} aria-label={dict.product.video} className={cn("grid h-20 w-16 place-items-center bg-charcoal text-ivory lg:h-24 lg:w-20", index === images.length ? "ring-1 ring-charcoal ring-offset-2" : "opacity-70")}>
              <Icon name="play" size={20} />
            </button>
          </li>
        )}
      </ul>

      {/* Main viewport */}
      <div className="relative min-w-0 flex-1">
        <div
          ref={track}
          tabIndex={0}
          onKeyDown={(e) => {
            const rtl = document.dir === "rtl";
            if (e.key === (rtl ? "ArrowLeft" : "ArrowRight")) go(1);
            if (e.key === (rtl ? "ArrowRight" : "ArrowLeft")) go(-1);
          }}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain bg-stone focus-visible:outline-offset-[-2px]"
        >
          {images.map((img, i) => (
            <div
              key={img.src}
              ref={(el) => {
                slides.current[i] = el;
              }}
              data-index={i}
              role="group"
              aria-roledescription="slide"
              aria-label={fmt(dict.product.imageOf, { n: i + 1, total })}
              className="relative aspect-[4/5] w-full shrink-0 snap-start md:aspect-[5/6]"
            >
              <button type="button" className="absolute inset-0 cursor-zoom-in" onClick={() => setLightbox(i)} aria-label={dict.product.fullscreen}>
                <Image src={img.src} alt={t(img.alt)} fill priority={i === 0} quality={85} sizes="(min-width:1024px) 58vw, 100vw" className="object-cover" />
              </button>
              {img.illustrative && <IllustrativeTag label={dict.demo.imageNote} />}
            </div>
          ))}
          {product.video && (
            <div
              ref={(el) => {
                slides.current[images.length] = el;
              }}
              data-index={images.length}
              className="relative aspect-[4/5] w-full shrink-0 snap-start md:aspect-[5/6]"
            >
              <video src={product.video.src} poster={product.video.poster} controls playsInline preload="none" className="absolute inset-0 size-full object-cover" />
            </div>
          )}
        </div>

        {total > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} className="absolute start-4 top-1/2 hidden size-12 -translate-y-1/2 place-items-center bg-ivory/80 backdrop-blur transition-colors hover:bg-ivory md:grid" aria-label={dict.product.prevImage}>
              <Icon name="arrow" size={18} className="rotate-180 rtl:rotate-0" />
            </button>
            <button type="button" onClick={() => go(1)} className="absolute end-4 top-1/2 hidden size-12 -translate-y-1/2 place-items-center bg-ivory/80 backdrop-blur transition-colors hover:bg-ivory md:grid" aria-label={dict.product.nextImage}>
              <Icon name="arrow" size={18} className="flip-rtl" />
            </button>
          </>
        )}
        <button type="button" onClick={() => setLightbox(Math.min(index, images.length - 1))} className="absolute end-4 top-4 grid size-11 place-items-center bg-ivory/80 backdrop-blur hover:bg-ivory" aria-label={dict.product.fullscreen}>
          <Icon name="expand" size={18} />
        </button>
        <div className="num pointer-events-none absolute bottom-4 start-4 bg-ivory/80 px-2.5 py-1 text-[11px] tracking-widest backdrop-blur" aria-hidden>
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </div>
      </div>

      <Lightbox
        items={images.map((i) => ({ src: i.src, alt: t(i.alt), caption: t(i.alt) }))}
        index={lightbox}
        onIndex={(i) => {
          setLightbox(i);
          onIndex(i);
        }}
        onClose={() => setLightbox(null)}
      />
    </div>
  );
}
