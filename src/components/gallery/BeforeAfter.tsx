"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useI18n } from "@/i18n/provider";
import type { ImageAsset } from "@/types/content";

/**
 * Drag / keyboard comparison slider. The native range input provides full
 * keyboard + screen-reader support; pointer dragging works anywhere on the image.
 */
export function BeforeAfter({ before, after, className }: { before: ImageAsset; after: ImageAsset; className?: string }) {
  const { dict, t, dir } = useI18n();
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const fromPointer = (clientX: number) => {
    const r = box.current!.getBoundingClientRect();
    let p = ((clientX - r.left) / r.width) * 100;
    if (dir === "rtl") p = 100 - p;
    setPos(Math.max(0, Math.min(100, p)));
  };

  // In RTL the "after" image is revealed from the right edge.
  const clip = dir === "rtl" ? `inset(0 0 0 ${100 - pos}%)` : `inset(0 ${100 - pos}% 0 0)`;

  return (
    <div
      ref={box}
      className={`relative select-none overflow-hidden bg-stone touch-pan-y ${className ?? "aspect-[16/10]"}`}
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        fromPointer(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && fromPointer(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <Image src={after.src} alt={`${dict.gallery.after}: ${t(after.alt)}`} fill sizes="(min-width:1024px) 80vw, 100vw" className="object-cover" />
      <div className="absolute inset-0" style={{ clipPath: clip }}>
        <Image src={before.src} alt={`${dict.gallery.before}: ${t(before.alt)}`} fill sizes="(min-width:1024px) 80vw, 100vw" className="object-cover grayscale-[35%]" />
      </div>

      <span className="eyebrow absolute start-4 top-4 bg-charcoal/70 px-3 py-1.5 text-ivory backdrop-blur">{dict.gallery.before}</span>
      <span className="eyebrow absolute end-4 top-4 bg-ivory/85 px-3 py-1.5 backdrop-blur">{dict.gallery.after}</span>

      <div className="pointer-events-none absolute inset-y-0 w-px bg-ivory" style={{ insetInlineStart: `${pos}%` }}>
        <span className="absolute top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 rtl:translate-x-1/2 place-items-center rounded-full bg-ivory text-charcoal shadow-lg">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden>
            <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
          </svg>
        </span>
      </div>

      <label className="sr-only" htmlFor="ba-range">{dict.gallery.drag}</label>
      <input
        id="ba-range"
        type="range"
        min={0}
        max={100}
        value={Math.round(pos)}
        onChange={(e) => setPos(Number(e.target.value))}
        className="absolute inset-0 size-full cursor-ew-resize opacity-0"
        aria-valuetext={`${Math.round(pos)}%`}
      />
    </div>
  );
}
