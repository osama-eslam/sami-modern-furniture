import type { MetadataRoute } from "next";
import { business } from "@/config/business";
import { categories } from "@/data/categories";
import { articles } from "@/data/content/articles";
import { policies } from "@/data/content/policies";
import { allProducts } from "@/lib/catalog";

const staticPaths = [
  "",
  "/about",
  "/shop",
  "/shop/new-arrivals",
  "/shop/best-sellers",
  "/shop/offers",
  "/categories",
  "/custom-furniture",
  "/inspiration",
  "/gallery",
  "/showroom",
  "/contact",
  "/faq",
  "/track-order",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...staticPaths,
    ...categories.map((c) => `/categories/${c.slug}`),
    ...allProducts().map((p) => `/products/${p.slug}`),
    ...articles.map((a) => `/inspiration/${a.slug}`),
    ...policies.map((p) => `/${p.slug}`),
  ];
  return paths.map((path) => ({
    url: `${business.url}/ar${path}`,
    alternates: { languages: { ar: `${business.url}/ar${path}`, en: `${business.url}/en${path}` } },
    changeFrequency: path.startsWith("/products") ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.startsWith("/products") || path.startsWith("/categories") ? 0.8 : 0.6,
  }));
}
