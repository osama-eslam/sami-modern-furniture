"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/provider";
import { fmt } from "@/i18n/config";
import { cn } from "@/lib/utils";
import { useDialog } from "../layout/useDialog";
import { Icon } from "../ui/Icon";

export type LightboxItem = { src: string; alt: string; caption?: string };

/**
 * Fullscreen viewer: keyboard (←/→/Esc), swipe, click-to-zoom with pointer
 * panning, focus trap. Used by product galleries and the gallery page.
 */
export function Lightbox({ items, index, onIndex, onClose }: { items: LightboxItem[]; index: number | null; onIndex: (i: number) => void; onClose: () => void }) {
  const { dict, dir } = useI18n();
  const open = index !== null;
  const ref = useDialog<HTMLDivElement>(open, onClose);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const start = useRef<{ x: number; y: number } | null>(null);

  const go = (delta: number) => {
    if (index === null) return;
    setZoom(false);
    onIndex((index + delta + items.length) % items.length);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      const forward = dir === "rtl" ? "ArrowLeft" : "ArrowRight";
      const back = dir === "rtl" ? "ArrowRight" : "ArrowLeft";
      if (e.key === forward) go(1);
      if (e.key === back) go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;
  const item = items[index];

  return (
    <div ref={ref} role="dialog" aria-modal="true" aria-label={item.alt} className="fixed inset-0 z-[160] flex flex-col bg-charcoal text-ivory on-dark" style={{ animation: "fade-in .4s ease both" }}>
      <div className="flex h-16 shrink-0 items-center justify-between px-4 md:px-8">
        <p className="num text-xs tracking-widest text-ivory/60">{fmt(dict.product.imageOf, { n: index + 1, total: items.length })}</p>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => setZoom((z) => !z)} className="grid size-11 place-items-center" aria-pressed={zoom} aria-label={dict.product.zoom}>
            <Icon name="zoomIn" size={22} />
          </button>
          <button type="button" onClick={onClose} className="grid size-11 place-items-center" aria-label={dict.common.close}>
            <Icon name="close" size={24} />
          </button>
        </div>
      </div>

      <div
        className={cn("relative flex-1 overflow-hidden touch-pan-y select-none", zoom ? "cursor-zoom-out" : "cursor-zoom-in")}
        onClick={() => setZoom((z) => !z)}
        onPointerMove={(e) => {
          if (!zoom) return;
          const r = e.currentTarget.getBoundingClientRect();
          setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
        }}
        onPointerDown={(e) => (start.current = { x: e.clientX, y: e.clientY })}
        onPointerUp={(e) => {
          if (!start.current || zoom) return;
          const dx = e.clientX - start.current.x;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(e.clientY - start.current.y)) {
            e.stopPropagation();
            go((dx < 0 ? 1 : -1) * (dir === "rtl" ? -1 : 1));
          }
          start.current = null;
        }}
      >
        <Image
          key={item.src}
          src={item.src}
          alt={item.alt}
          fill
          sizes="100vw"
          quality={85}
          className="object-contain transition-transform duration-500 ease-out"
          style={{ transform: zoom ? "scale(2.2)" : "scale(1)", transformOrigin: origin, animation: "fade-in .5s ease both" }}
        />
      </div>

      <div className="flex h-20 shrink-0 items-center justify-between gap-4 px-4 md:px-8">
        <button type="button" onClick={() => go(-1)} className="grid size-12 place-items-center border border-ivory/20 hover:bg-ivory hover:text-charcoal transition-colors" aria-label={dict.product.prevImage}>
          <Icon name="arrow" size={18} className="rotate-180 rtl:rotate-0" />
        </button>
        <p className="line-clamp-1 text-center text-sm text-ivory/70">{item.caption}</p>
        <button type="button" onClick={() => go(1)} className="grid size-12 place-items-center border border-ivory/20 hover:bg-ivory hover:text-charcoal transition-colors" aria-label={dict.product.nextImage}>
          <Icon name="arrow" size={18} className="flip-rtl" />
        </button>
      </div>
    </div>
  );
}
