"use client";

import { createContext, useContext, useMemo } from "react";
import type { Locale } from "@/types/content";
import type { Dictionary } from "./dictionaries/en";
import { dirOf, localePath, tr } from "./config";
import type { L10n } from "@/types/content";

type Ctx = {
  locale: Locale;
  dict: Dictionary;
  dir: "rtl" | "ltr";
  href: (path?: string) => string;
  t: (v: L10n | undefined | null) => string;
};

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ locale, dict, children }: { locale: Locale; dict: Dictionary; children: React.ReactNode }) {
  const value = useMemo<Ctx>(
    () => ({ locale, dict, dir: dirOf(locale), href: (p = "/") => localePath(locale, p), t: (v) => tr(v, locale) }),
    [locale, dict],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
};
