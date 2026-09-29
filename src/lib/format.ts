import type { Locale } from "@/types/content";

const nf = {
  ar: new Intl.NumberFormat("ar-EG-u-nu-latn", { maximumFractionDigits: 0 }),
  en: new Intl.NumberFormat("en-EG", { maximumFractionDigits: 0 }),
};

export const formatNumber = (n: number, locale: Locale) => nf[locale].format(n);

export const formatPrice = (amount: number, locale: Locale) =>
  locale === "ar" ? `${nf.ar.format(amount)} ج.م` : `EGP ${nf.en.format(amount)}`;

export const formatDate = (iso: string, locale: Locale, withTime = false) =>
  new Intl.DateTimeFormat(locale === "ar" ? "ar-EG-u-nu-latn" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}),
    timeZone: "Africa/Cairo",
  }).format(new Date(iso));

export const formatTime = (hhmm: string, locale: Locale) => {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date(Date.UTC(2000, 0, 1, h, m));
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG-u-nu-latn" : "en-US", { hour: "numeric", minute: "2-digit", timeZone: "UTC" }).format(d);
};

export const formatPhone = (e164: string) => {
  // +201552085870 → +20 155 208 5870
  const m = e164.match(/^\+20(\d{3})(\d{3})(\d{4})$/);
  if (m) return `+20 ${m[1]} ${m[2]} ${m[3]}`;
  const l = e164.match(/^\+20(\d)(\d{3})(\d{4})$/);
  if (l) return `+20 ${l[1]} ${l[2]} ${l[3]}`;
  return e164;
};
