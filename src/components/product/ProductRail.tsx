"use client";

import { useRef } from "react";
import { useI18n } from "@/i18n/provider";
import type { Product } from "@/types/commerce";
import { Icon } from "../ui/Icon";
import { ProductCard } from "./ProductCard";

/** Horizontal, swipeable product row with arrow controls on desktop. */
export function ProductRail({ products, label }: { products: Product[]; label: string }) {
  const { dict } = useI18n();
  const ref = useRef<HTMLUListElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const rtl = document.dir === "rtl" ? -1 : 1;
    el.scrollBy({ left: dir * rtl * el.clientWidth * 0.8, behavior: "smooth" });
  };
  if (!products.length) return null;
  return (
    <div className="relative" role="region" aria-label={label}>
      <ul ref={ref} className="no-scrollbar -mx-[var(--gutter)] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] scroll-px-[var(--gutter)] md:gap-6">
        {products.map((p, i) => (
          <li key={p.id} className="w-[72vw] shrink-0 snap-start xs:w-[58vw] sm:w-[40vw] md:w-[30vw] lg:w-[23vw] 3xl:w-[20vw]">
            <ProductCard product={p} index={i} sizes="(min-width:1024px) 23vw, 70vw" />
          </li>
        ))}
      </ul>
      {products.length > 3 && (
        <div className="mt-8 hidden justify-end gap-2 md:flex">
          <button type="button" onClick={() => scroll(-1)} className="grid size-12 place-items-center border hairline hover:border-charcoal" aria-label={dict.common.previous}>
            <Icon name="arrow" size={18} className="rotate-180 rtl:rotate-0" />
          </button>
          <button type="button" onClick={() => scroll(1)} className="grid size-12 place-items-center border hairline hover:border-charcoal" aria-label={dict.common.next}>
            <Icon name="arrow" size={18} className="flip-rtl" />
          </button>
        </div>
      )}
    </div>
  );
}
