/**
 * VERIFIED BUSINESS DATA
 * ---------------------------------------------------------------------------
 * Everything in this file comes from public sources about Samy Modern.
 * Each block lists its source. Do not add claims here without a source —
 * unknown values stay `null` and the UI hides them automatically.
 *
 * Sources
 *  [S1] samymodern.com (owner's existing website, fetched 2026-09-29)
 *  [S2] furniture1000.com listing (from the brand's Facebook page)
 *  [S3] Brief supplied by the client (phones, map pin, social links)
 */
import type { L10n } from "@/types/content";

export const business = {
  name: { ar: "سامي مودرن للأثاث", en: "Samy Modern" } satisfies L10n,
  shortName: { ar: "سامي مودرن", en: "Samy Modern" } satisfies L10n,
  // [S1] — the brand's own line: "لان التفاصيل تصنع الفرق"
  tagline: { ar: "تفاصيل تصنع الفرق", en: "Details Make The Difference" } satisfies L10n,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.samymodern.com",

  phones: {
    // [S1][S3] main line, also the WhatsApp number
    primary: "+201552085870",
    // [S3] additional published phones
    secondary: ["+201225459512", "+201110622555"],
    // [S2] landline
    landline: "+2035858413",
  },
  whatsapp: "201552085870", // [S3] wa.me/201552085870

  // [S1] shown in the footer & contact page of the existing site
  emails: {
    info: "info@samymodern.com",
    contact: "contact@samymodern.com",
    support: "support@samymodern.com",
  },

  branches: [
    {
      id: "fleming",
      primary: true,
      name: { ar: "معرض فلمنج", en: "Fleming Showroom" },
      // [S3] + landmarks from [S2]
      address: {
        ar: "59 شارع الفتح، فلمنج، الإسكندرية، مصر",
        en: "59 El Fath Street, Fleming, Alexandria, Egypt",
      },
      landmark: {
        ar: "محطة ترام فلمنج — بجوار بنك مصر، أمام مستشفى البترول",
        en: "Fleming tram stop — next to Banque Misr, opposite the Petroleum Hospital",
      },
      geo: { lat: 31.23406, lng: 29.96224 }, // [S3]
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=31.23406,29.96224",
      directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=31.23406,29.96224",
    },
    {
      id: "miami",
      primary: false,
      name: { ar: "فرع ميامي", en: "Miami Branch" },
      // [S1] listed under "فروعنا" on the existing website's contact page
      address: {
        ar: "83 شارع البكباشي العيسوي، سيدي بشر بحري، ميامي، الإسكندرية، مصر",
        en: "83 El Bekbashy El Esawy St, Sidi Bishr Bahary, Miami, Alexandria, Egypt",
      },
      landmark: null,
      geo: null, // exact pin not published — add when confirmed
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=" +
        encodeURIComponent("83 El Bekbashy El Esawy St, Sidi Bishr, Alexandria, Egypt"),
      directionsUrl: null,
    },
  ],

  /**
   * [S1] Opening hours. Day index: 0 = Sunday … 6 = Saturday. 24h clock.
   * "الجمعة والأحد: 12:00 م – 11:00 م / السبت والاثنين – الخميس: 11:00 ص – 11:00 م"
   */
  hours: [
    { day: 0, open: "12:00", close: "23:00" },
    { day: 1, open: "11:00", close: "23:00" },
    { day: 2, open: "11:00", close: "23:00" },
    { day: 3, open: "11:00", close: "23:00" },
    { day: 4, open: "11:00", close: "23:00" },
    { day: 5, open: "12:00", close: "23:00" },
    { day: 6, open: "11:00", close: "23:00" },
  ],

  social: {
    facebook: "https://www.facebook.com/214325021914349", // [S3]
    instagram: "https://www.instagram.com/samymodern/", // [S3]
    tiktok: "https://www.tiktok.com/@samy_modern", // [S1]
    youtube: "https://youtube.com/@samymodern", // [S1]
  },

  directories: {
    furniture1000: "https://www.furniture1000.com/EG/Alexandria/214325021914349/Samy-modern",
    yallahome:
      "https://yallahome.com/%D9%85%D8%B9%D8%A7%D8%B1%D8%B6-%D9%88%D8%B4%D8%B1%D9%83%D8%A7%D8%AA/Samy-modern-%D8%B3%D8%A7%D9%85%D9%89-%D9%85%D9%88%D8%AF%D8%B1%D9%86",
    worldplaces: "https://egypt.worldplaces.me/view-place/58964341-samy-modern.html",
  },

  /**
   * [S1] "مستندين إلى خبرة تمتد لأكثر من 15 عامًا" — stated by the brand itself.
   */
  experienceYears: 15,

  /**
   * [S1] Scope of work described in the brand's vision statement.
   */
  scope: [
    { ar: "الأثاث", en: "Furniture" },
    { ar: "المطابخ", en: "Kitchens" },
    { ar: "الستائر", en: "Curtains" },
    { ar: "الإضاءة والنجف", en: "Lighting & chandeliers" },
    { ar: "الإكسسوارات", en: "Accessories" },
    { ar: "التصميم الداخلي", en: "Interior design" },
    { ar: "التشطيبات", en: "Finishing" },
  ] satisfies L10n[],

  currency: "EGP",
  country: "EG",
} as const;

export type Business = typeof business;
export type Branch = (typeof business.branches)[number];
export const primaryBranch = business.branches[0];
