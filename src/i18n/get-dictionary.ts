import type { Locale } from "@/types/content";
import { ar } from "./dictionaries/ar";
import { en, type Dictionary } from "./dictionaries/en";

const dictionaries: Record<Locale, Dictionary> = { ar, en };

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];
export type { Dictionary };
