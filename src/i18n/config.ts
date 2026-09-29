import type { L10n, Locale } from "@/types/content";

export const locales: Locale[] = ["ar", "en"];
export const defaultLocale: Locale = "ar";

export const isLocale = (value: string): value is Locale => (locales as string[]).includes(value);

export const dirOf = (locale: Locale) => (locale === "ar" ? "rtl" : "ltr");

/** Pick the right language from a localized value. */
export const tr = (value: L10n | undefined | null, locale: Locale) => (value ? value[locale] : "");

/** Prefix an internal path with the locale. */
export const localePath = (locale: Locale, path = "/") => {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
};

/** Simple template interpolation: "Hello {name}" */
export const fmt = (template: string, vars: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
