"use client";

/**
 * Client state. Guest data lives in localStorage; the repository functions in
 * services/ are the seam where an authenticated backend takes over.
 */
import { siteConfig } from "@/config/site";
import { normalizeSelection, productById } from "@/lib/catalog";
import type { Address, CartLine, Order } from "@/types/commerce";
import type { L10n } from "@/types/content";
import { uid } from "@/lib/utils";
import { createStore } from "./create-store";

/* ---------------------------------------------------------------------- cart */

type CartState = { lines: CartLine[]; saved: CartLine[]; coupon?: string };
export const cartStore = createStore<CartState>({ lines: [], saved: [] }, { key: "sm.cart", version: 1 });

const lineKey = (productId: string, selection: Record<string, string>) =>
  `${productId}|${Object.entries(selection)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join(",")}`;

export const cart = {
  add(productId: string, selection: Record<string, string>, quantity = 1) {
    const product = productById(productId);
    if (!product) return;
    const sel = normalizeSelection(product, selection);
    const key = lineKey(productId, sel);
    cartStore.set((s) => {
      const existing = s.lines.find((l) => l.key === key);
      const lines = existing
        ? s.lines.map((l) => (l.key === key ? { ...l, quantity: Math.min(99, l.quantity + quantity) } : l))
        : [...s.lines, { key, productId, selection: sel, quantity, addedAt: Date.now() }];
      return { ...s, lines };
    });
    ui.set((u) => ({ ...u, cartOpen: true, lastAdded: key }));
  },
  setQuantity(key: string, quantity: number) {
    cartStore.set((s) => ({ ...s, lines: s.lines.map((l) => (l.key === key ? { ...l, quantity: Math.max(1, Math.min(99, quantity)) } : l)) }));
  },
  remove(key: string) {
    cartStore.set((s) => ({ ...s, lines: s.lines.filter((l) => l.key !== key) }));
  },
  saveForLater(key: string) {
    cartStore.set((s) => {
      const line = s.lines.find((l) => l.key === key);
      if (!line) return s;
      return { ...s, lines: s.lines.filter((l) => l.key !== key), saved: [line, ...s.saved.filter((l) => l.key !== key)] };
    });
  },
  moveToCart(key: string) {
    cartStore.set((s) => {
      const line = s.saved.find((l) => l.key === key);
      if (!line) return s;
      return { ...s, saved: s.saved.filter((l) => l.key !== key), lines: [...s.lines.filter((l) => l.key !== key), line] };
    });
  },
  removeSaved(key: string) {
    cartStore.set((s) => ({ ...s, saved: s.saved.filter((l) => l.key !== key) }));
  },
  setCoupon(code?: string) {
    cartStore.set((s) => ({ ...s, coupon: code }));
  },
  clear() {
    cartStore.set((s) => ({ ...s, lines: [], coupon: undefined }));
  },
};

/* --------------------------------------------------- wishlist / compare / recent */

type IdList = { ids: string[] };
export const wishlistStore = createStore<IdList>({ ids: [] }, { key: "sm.wishlist", version: 1 });
export const compareStore = createStore<IdList>({ ids: [] }, { key: "sm.compare", version: 1 });
export const recentStore = createStore<IdList>({ ids: [] }, { key: "sm.recent", version: 1 });
export const recentSearchStore = createStore<{ terms: string[] }>({ terms: [] }, { key: "sm.searches", version: 1 });

export const wishlist = {
  toggle(id: string) {
    wishlistStore.set((s) => ({ ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [id, ...s.ids] }));
  },
  addMany(ids: string[]) {
    wishlistStore.set((s) => ({ ids: [...new Set([...ids, ...s.ids])] }));
  },
  remove(id: string) {
    wishlistStore.set((s) => ({ ids: s.ids.filter((x) => x !== id) }));
  },
};

export const compare = {
  /** returns false when the limit is reached */
  toggle(id: string): boolean {
    const { ids } = compareStore.get();
    if (ids.includes(id)) {
      compareStore.set({ ids: ids.filter((x) => x !== id) });
      return true;
    }
    if (ids.length >= siteConfig.compareLimit) return false;
    compareStore.set({ ids: [...ids, id] });
    return true;
  },
  clear() {
    compareStore.set({ ids: [] });
  },
};

export const recent = {
  push(id: string) {
    recentStore.set((s) => ({ ids: [id, ...s.ids.filter((x) => x !== id)].slice(0, siteConfig.recentlyViewedLimit) }));
  },
};

export const recentSearches = {
  push(term: string) {
    const t = term.trim();
    if (t.length < 2) return;
    recentSearchStore.set((s) => ({ terms: [t, ...s.terms.filter((x) => x.toLowerCase() !== t.toLowerCase())].slice(0, 6) }));
  },
  clear() {
    recentSearchStore.set({ terms: [] });
  },
};

/* ------------------------------------------------------------ account & orders */

export type LocalUser = { id: string; fullName: string; phone: string; email?: string; createdAt: string };
export type Notice = { id: string; text: L10n; href?: string; at: string; read: boolean };

type AccountState = { user: LocalUser | null; addresses: Address[]; notifications: Notice[] };
export const accountStore = createStore<AccountState>({ user: null, addresses: [], notifications: [] }, { key: "sm.account", version: 1 });

/** Orders placed from this device (guest or signed-in). */
export const ordersStore = createStore<{ orders: Order[] }>({ orders: [] }, { key: "sm.orders", version: 1 });

export const addresses = {
  upsert(address: Omit<Address, "id"> & { id?: string }) {
    accountStore.set((s) => {
      const id = address.id ?? uid("addr_");
      const isFirst = s.addresses.length === 0;
      const next: Address = { ...address, id, isDefault: address.isDefault || isFirst };
      let list = s.addresses.some((a) => a.id === id) ? s.addresses.map((a) => (a.id === id ? next : a)) : [...s.addresses, next];
      if (next.isDefault) list = list.map((a) => ({ ...a, isDefault: a.id === id }));
      return { ...s, addresses: list };
    });
  },
  remove(id: string) {
    accountStore.set((s) => {
      const list = s.addresses.filter((a) => a.id !== id);
      if (list.length && !list.some((a) => a.isDefault)) list[0] = { ...list[0], isDefault: true };
      return { ...s, addresses: list };
    });
  },
  setDefault(id: string) {
    accountStore.set((s) => ({ ...s, addresses: s.addresses.map((a) => ({ ...a, isDefault: a.id === id })) }));
  },
};

export const notifications = {
  push(text: L10n, href?: string) {
    accountStore.set((s) => ({ ...s, notifications: [{ id: uid("n_"), text, href, at: new Date().toISOString(), read: false }, ...s.notifications].slice(0, 50) }));
  },
  markAllRead() {
    accountStore.set((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) }));
  },
};

/* ------------------------------------------------------------------------ UI */

type UiState = {
  cartOpen: boolean;
  searchOpen: boolean;
  menuOpen: boolean;
  quickViewId: string | null;
  lastAdded: string | null;
  toast: { id: number; text: string } | null;
};
export const ui = createStore<UiState>({ cartOpen: false, searchOpen: false, menuOpen: false, quickViewId: null, lastAdded: null, toast: null });

export const toast = (text: string) => ui.set((u) => ({ ...u, toast: { id: Date.now(), text } }));
