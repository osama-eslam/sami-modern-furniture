/**
 * Single entry point for catalog data. Swap the demo catalog for a real source
 * here (CMS, API, database). Everything else reads through `lib/catalog.ts`.
 */
import type { Product } from "@/types/commerce";
import { demoProducts } from "./demo/products";

export const productSource: Product[] = demoProducts;
