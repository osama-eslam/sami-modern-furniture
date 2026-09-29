"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { categoryBySlug } from "@/data/categories";
import { useI18n } from "@/i18n/provider";
import { fmt } from "@/i18n/config";
import { productById, productsByIds } from "@/lib/catalog";
import { whatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { compare, compareStore, ui } from "@/store/stores";
import { ProductView } from "../product/ProductView";
import { Icon } from "../ui/Icon";
import { useDialog } from "./useDialog";

export function QuickView() {
  const { dict, href, t } = useI18n();
  const { quickViewId } = ui.use();
  const product = quickViewId ? productById(quickViewId) : undefined;
  const close = () => ui.set((u) => ({ ...u, quickViewId: null }));
  const ref = useDialog<HTMLDivElement>(!!product, close);

  return (
    <>
      <div className="overlay-backdrop" data-open={!!product} onClick={close} aria-hidden />
      {product && (
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-label={t(product.name)}
          className="fixed inset-x-0 bottom-0 z-[90] max-h-[92dvh] overflow-y-auto bg-ivory md:inset-auto md:start-1/2 md:top-1/2 md:w-[min(1040px,92vw)] md:-translate-x-1/2 md:-translate-y-1/2 rtl:md:translate-x-1/2"
          style={{ animation: "fade-up .6s cubic-bezier(.16,1,.3,1) both" }}
        >
          <button type="button" onClick={close} className="absolute end-3 top-3 z-10 grid size-11 place-items-center bg-ivory/80" aria-label={dict.common.close}>
            <Icon name="close" size={22} />
          </button>
          <div className="grid md:grid-cols-2">
            <div className="relative aspect-[4/3] bg-stone md:aspect-auto md:min-h-[560px]">
              <Image src={product.images[0].src} alt={t(product.images[0].alt)} fill sizes="(min-width:768px) 520px, 100vw" className="object-cover" />
            </div>
            <div className="p-6 md:p-10">
              <ProductView product={product} categoryName={t(categoryBySlug(product.category)?.name)} compact />
              <Link href={href(`/products/${product.slug}`)} className="link-line mt-6 text-sm">
                {dict.product.viewDetails} <Icon name="arrow" size={14} className="flip-rtl" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function CompareBar() {
  const { dict, href, t } = useI18n();
  const pathname = usePathname();
  const { ids } = compareStore.use();
  const products = productsByIds(ids);
  const hidden = ids.length === 0 || pathname.endsWith("/compare") || pathname.includes("/checkout");
  return (
    <div
      className={cn(
        "fixed start-1/2 z-[55] w-[min(640px,calc(100vw-2rem))] -translate-x-1/2 rtl:translate-x-1/2 bg-charcoal text-ivory shadow-[0_20px_60px_-20px_rgba(0,0,0,.5)] transition-all duration-700 bottom-[calc(var(--bottom-nav-h)+1rem)]",
        hidden ? "pointer-events-none translate-y-6 opacity-0" : "opacity-100",
      )}
      aria-hidden={hidden}
    >
      <div className="flex items-center gap-4 p-3">
        <ul className="flex -space-x-3 rtl:space-x-reverse">
          {products.map((p) => (
            <li key={p.id} className="relative size-11 overflow-hidden border-2 border-charcoal bg-stone">
              <Image src={p.images[0].src} alt={t(p.name)} fill sizes="44px" className="object-cover" />
            </li>
          ))}
        </ul>
        <p className="flex-1 text-sm">{fmt(dict.compare.bar, { count: ids.length })}</p>
        <button type="button" onClick={compare.clear} className="px-2 text-xs text-ivory/60 hover:text-ivory" tabIndex={hidden ? -1 : 0}>
          {dict.compare.clear}
        </button>
        <Link href={href("/compare")} className="btn btn-light btn-sm" tabIndex={hidden ? -1 : 0}>
          {dict.compare.open}
        </Link>
      </div>
    </div>
  );
}

/** Floating WhatsApp shortcut on desktop (mobile has it in the header). */
export function WhatsAppFab() {
  const { dict } = useI18n();
  return (
    <a
      href={whatsappLink(dict.whatsappMessages.general)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={dict.common.chatWhatsapp}
      className="group fixed bottom-6 end-6 z-[50] hidden items-center gap-3 bg-[#1f3b2d] py-3 ps-3 pe-3 text-ivory shadow-[0_18px_40px_-18px_rgba(0,0,0,.6)] transition-all duration-500 hover:pe-5 lg:flex"
    >
      <Icon name="whatsapp" size={22} />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm transition-all duration-500 group-hover:max-w-40">{dict.common.chatWhatsapp}</span>
    </a>
  );
}

