"use client";

import { useMemo } from "react";
import { computeTotals, priceLines } from "@/lib/pricing";
import { cartStore } from "@/store/stores";

/** Priced view of the cart. Prices always come from the catalog, never storage. */
export function useCart(governorate?: string) {
  const state = cartStore.use();
  return useMemo(() => {
    const lines = priceLines(state.lines);
    const saved = priceLines(state.saved);
    const totals = computeTotals(lines, state.coupon, governorate);
    const count = lines.reduce((n, l) => n + l.quantity, 0);
    return { lines, saved, totals, count, coupon: state.coupon };
  }, [state, governorate]);
}
