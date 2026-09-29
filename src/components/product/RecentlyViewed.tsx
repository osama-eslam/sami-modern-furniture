"use client";

import { useI18n } from "@/i18n/provider";
import { productsByIds } from "@/lib/catalog";
import { recentStore } from "@/store/stores";
import { SectionHeading } from "../ui/primitives";
import { ProductRail } from "./ProductRail";

export function RecentlyViewed({ excludeId, className }: { excludeId?: string; className?: string }) {
  const { dict } = useI18n();
  const { ids } = recentStore.use();
  const products = productsByIds(ids.filter((id) => id !== excludeId));
  if (!products.length) return null;
  return (
    <section className={className}>
      <div className="container-x">
        <SectionHeading eyebrow="SAMY MODERN / HISTORY" title={dict.product.recentlyViewed} />
        <div className="mt-12">
          <ProductRail products={products} label={dict.product.recentlyViewed} />
        </div>
      </div>
    </section>
  );
}
