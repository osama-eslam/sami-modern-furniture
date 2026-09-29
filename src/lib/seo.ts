import type { Metadata } from "next";
import { business, primaryBranch } from "@/config/business";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/config";
import type { Product } from "@/types/commerce";
import type { Locale } from "@/types/content";
import { resolveVariant } from "./catalog";

export const absoluteUrl = (path: string) => new URL(path, business.url).toString();

type MetaInput = {
  locale: Locale;
  path: string; // without locale prefix, e.g. "/shop"
  title?: string;
  description?: string;
  image?: string;
  noindex?: boolean;
  type?: "website" | "article";
};

export const buildMetadata = ({ locale, path, title, description, image, noindex, type = "website" }: MetaInput): Metadata => {
  const dict = getDictionary(locale);
  const fullTitle = title ? `${title} | ${dict.meta.siteName}` : dict.meta.defaultTitle;
  const desc = description ?? dict.meta.defaultDescription;
  const url = localePath(locale, path);
  const ogImage = image ?? `/${locale}/opengraph-image`;
  return {
    title: { absolute: fullTitle },
    description: desc,
    alternates: {
      canonical: url,
      languages: { ar: localePath("ar", path), en: localePath("en", path), "x-default": localePath("ar", path) },
    },
    openGraph: {
      type,
      url,
      title: fullTitle,
      description: desc,
      siteName: dict.meta.siteName,
      locale: locale === "ar" ? "ar_EG" : "en_US",
      alternateLocale: locale === "ar" ? ["en_US"] : ["ar_EG"],
      images: [{ url: ogImage, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description: desc, images: [ogImage] },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
};

/* ------------------------------------------------------------------ JSON-LD */

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const storeJsonLd = (locale: Locale) => ({
  "@context": "https://schema.org",
  "@type": "FurnitureStore",
  "@id": absoluteUrl("/#store"),
  name: business.name[locale],
  alternateName: [business.name.ar, business.name.en, business.shortName.ar],
  url: absoluteUrl(localePath(locale)),
  logo: absoluteUrl("/brand-mark.png"),
  image: absoluteUrl("/brand-mark.png"),
  slogan: business.tagline[locale],
  telephone: business.phones.primary,
  email: business.emails.info,
  priceRange: "EGP",
  currenciesAccepted: "EGP",
  address: {
    "@type": "PostalAddress",
    streetAddress: locale === "ar" ? "59 شارع الفتح، فلمنج" : "59 El Fath Street, Fleming",
    addressLocality: locale === "ar" ? "الإسكندرية" : "Alexandria",
    addressCountry: "EG",
  },
  geo: { "@type": "GeoCoordinates", latitude: primaryBranch.geo!.lat, longitude: primaryBranch.geo!.lng },
  hasMap: primaryBranch.mapsUrl,
  openingHoursSpecification: business.hours.map((h) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: `https://schema.org/${dayNames[h.day]}`,
    opens: h.open,
    closes: h.close,
  })),
  sameAs: Object.values(business.social),
  areaServed: { "@type": "City", name: "Alexandria" },
});

export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absoluteUrl(it.path) })),
});

const schemaAvailability: Record<Product["availability"], string> = {
  in_stock: "https://schema.org/InStock",
  made_to_order: "https://schema.org/MadeToOrder",
  pre_order: "https://schema.org/PreOrder",
  coming_soon: "https://schema.org/PreOrder",
  out_of_stock: "https://schema.org/OutOfStock",
};

/**
 * Product schema. No review/rating data is ever emitted. Price/offer data is
 * only emitted for the real catalog (not the illustrative preview catalog).
 */
export const productJsonLd = (product: Product, locale: Locale) => {
  const r = resolveVariant(product);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name[locale],
    description: product.description[locale],
    image: product.images.map((i) => i.src),
    sku: r.sku,
    brand: { "@type": "Brand", name: business.shortName.en },
    category: product.category,
    url: absoluteUrl(localePath(locale, `/products/${product.slug}`)),
    ...(siteConfig.demoCatalog
      ? {}
      : {
          offers: {
            "@type": "Offer",
            priceCurrency: "EGP",
            price: r.price,
            availability: schemaAvailability[r.availability],
            seller: { "@id": absoluteUrl("/#store") },
            url: absoluteUrl(localePath(locale, `/products/${product.slug}`)),
          },
        }),
  };
};
