/**
 * Site-wide switches. The single most important one is `demoCatalog`:
 * while true, products/prices are the illustrative preview catalog and the UI
 * says so. Set it to false once the real catalog is connected.
 */
export const siteConfig = {
  demoCatalog: true,
  /** Orders go to ORDER_WEBHOOK_URL when set; otherwise the flow is in preview mode. */
  defaultLocale: "ar" as const,
  locales: ["ar", "en"] as const,
  itemsPerPage: 12,
  recentlyViewedLimit: 12,
  compareLimit: 4,
};
