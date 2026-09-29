"use client";

import { useSearchParams } from "next/navigation";
import { fmt } from "@/i18n/config";
import { useI18n } from "@/i18n/provider";
import { defaultSelection, isPurchasable, productsByIds } from "@/lib/catalog";
import { useHydrated } from "@/store/create-store";
import { cart, toast, ui, wishlist, wishlistStore } from "@/store/stores";
import { ProductCard } from "../product/ProductCard";
import { RecentlyViewed } from "../product/RecentlyViewed";
import { Icon } from "../ui/Icon";
import { EmptyState } from "../ui/primitives";

export function WishlistView() {
  const { dict, href, locale } = useI18n();
  const hydrated = useHydrated();
  const params = useSearchParams();
  const { ids } = wishlistStore.use();
  const shared = (params.get("ids") ?? "").split(",").filter(Boolean).slice(0, 60);
  const sharedProducts = productsByIds(shared);
  const products = productsByIds(ids);

  if (!hydrated) return <div className="container-x min-h-[50vh]" />;

  const share = async () => {
    const url = `${window.location.origin}${href("/wishlist")}?ids=${ids.join(",")}`;
    try {
      if (navigator.share) await navigator.share({ title: dict.wishlist.sharedTitle, url });
      else {
        await navigator.clipboard.writeText(url);
        toast(dict.common.copied);
      }
    } catch {
      /* cancelled */
    }
  };

  const moveToCart = (id: string) => {
    const p = products.find((x) => x.id === id);
    if (!p) return;
    if (p.options.length) ui.set((u) => ({ ...u, quickViewId: p.id }));
    else {
      cart.add(p.id, defaultSelection(p));
      wishlist.remove(p.id);
    }
  };

  return (
    <>
      {sharedProducts.length > 0 && (
        <section className="container-x mb-20" aria-labelledby="shared-title">
          <div className="flex flex-col gap-6 border-y hairline bg-paper px-5 py-8 md:flex-row md:items-center md:justify-between md:px-8">
            <div>
              <h2 id="shared-title" className="font-display text-h3">{dict.wishlist.sharedTitle}</h2>
              <p className="mt-2 text-sm text-mute">{dict.wishlist.sharedBody}</p>
            </div>
            <button
              type="button"
              className="btn btn-primary shrink-0"
              onClick={() => {
                wishlist.addMany(sharedProducts.map((p) => p.id));
                toast(dict.wishlist.saveAll);
              }}
            >
              <Icon name="heart" size={16} /> {dict.wishlist.saveAll}
            </button>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
            {sharedProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      <div className="container-x pb-24">
        {products.length === 0 ? (
          sharedProducts.length === 0 && <EmptyState icon="heart" title={dict.wishlist.empty} body={dict.wishlist.emptyBody} action={{ href: href("/shop"), label: dict.cart.continue }} />
        ) : (
          <>
            <div className="flex items-center justify-between gap-4 border-b border-charcoal pb-4">
              <p className="num text-sm text-mute">{products.length === 1 ? dict.common.item : fmt(dict.common.items, { count: products.length })}</p>
              <button type="button" onClick={share} className="link-line text-sm">
                <Icon name="share" size={16} /> {dict.wishlist.share}
              </button>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-14 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
              {products.map((p, i) => (
                <div key={p.id} className="flex flex-col">
                  <ProductCard product={p} index={i} />
                  <button
                    type="button"
                    disabled={!isPurchasable(p.availability)}
                    onClick={() => moveToCart(p.id)}
                    className="btn btn-outline btn-sm mt-4 w-full"
                    lang={locale}
                  >
                    <Icon name="bag" size={15} /> {dict.wishlist.moveToCart}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <RecentlyViewed className="section !pt-0" />
    </>
  );
}
