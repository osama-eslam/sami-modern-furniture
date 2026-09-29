/**
 * COUPONS — backend-ready shape. Codes are validated on the server when an
 * order is placed (see app/api/orders/route.ts), never trusted from the client.
 * Real codes should live in a database; `demo` codes only work while
 * siteConfig.demoCatalog is true.
 */
import type { Coupon } from "@/types/commerce";

export const coupons: Coupon[] = [
  { code: "PREVIEW10", type: "percentage", value: 10, minSubtotal: 20000, active: true, demo: true },
];
