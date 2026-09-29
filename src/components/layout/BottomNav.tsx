"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";
import { cartStore, ui, wishlistStore } from "@/store/stores";
import { Icon, type IconName } from "../ui/Icon";

/** App-style bottom navigation for phones & tablets. */
export function BottomNav() {
  const { dict, href } = useI18n();
  const pathname = usePathname();
  const rest = pathname.replace(/^\/(ar|en)/, "") || "/";
  const { lines } = cartStore.use();
  const { ids } = wishlistStore.use();
  const count = lines.reduce((n, l) => n + l.quantity, 0);

  const item = (active: boolean) =>
    cn("relative flex flex-1 flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors", active ? "text-charcoal" : "text-mute");


  return (
    <nav aria-label="Mobile" className="fixed inset-x-0 bottom-0 z-[65] border-t hairline bg-ivory/92 backdrop-blur-xl lg:hidden pb-[env(safe-area-inset-bottom)]">
      <div className="flex h-16">
        <Link href={href("/")} className={item(rest === "/")}>
          <Inner icon="home" label={dict.nav.home} active={rest === "/"} />
        </Link>
        <Link href={href("/shop")} className={item(rest.startsWith("/shop") || rest.startsWith("/categories") || rest.startsWith("/products"))}>
          <Inner icon="grid" label={dict.nav.shop} active={rest.startsWith("/shop") || rest.startsWith("/categories") || rest.startsWith("/products")} />
        </Link>
        <button type="button" className={item(false)} onClick={() => ui.set((u) => ({ ...u, searchOpen: true }))}>
          <Inner icon="search" label={dict.nav.search} active={false} />
        </button>
        <Link href={href("/wishlist")} className={item(rest.startsWith("/wishlist"))}>
          <Inner icon="heart" label={dict.nav.wishlist} n={ids.length} active={rest.startsWith("/wishlist")} />
        </Link>
        <button type="button" className={item(rest.startsWith("/cart"))} onClick={() => ui.set((u) => ({ ...u, cartOpen: true }))}>
          <Inner icon="bag" label={dict.nav.cart} n={count} active={rest.startsWith("/cart")} />
        </button>
      </div>
    </nav>
  );
}

function Inner({ icon, label, n, active }: { icon: IconName; label: string; n?: number; active: boolean }) {
  return (
    <>
      <span className="relative">
        <Icon name={icon} size={22} strokeWidth={active ? 1.6 : 1.25} />
        {!!n && <span key={n} className="heart-pop num absolute -end-2 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-charcoal px-1 text-[9px] text-ivory">{n}</span>}
      </span>
      <span>{label}</span>
    {active && <span className="absolute top-0 h-px w-8 bg-charcoal" />}
    </>
  );
}
