import type { Metadata, Viewport } from "next";
import { Alexandria, IBM_Plex_Sans_Arabic, Manrope } from "next/font/google";
import { notFound } from "next/navigation";
import { business } from "@/config/business";
import { siteConfig } from "@/config/site";
import { dirOf, isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { I18nProvider } from "@/i18n/provider";
import { buildMetadata, storeJsonLd } from "@/lib/seo";
import { BottomNav } from "@/components/layout/BottomNav";
import { Cursor, RevealObserver, RouteChangeReset, ScrollLock, ScrollProgress, Toast } from "@/components/layout/effects";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Loader } from "@/components/layout/Loader";
import { MenuOverlay } from "@/components/layout/MenuOverlay";
import { MiniCart } from "@/components/layout/MiniCart";
import { CompareBar, QuickView, WhatsAppFab } from "@/components/layout/overlays";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { JsonLd } from "@/components/ui/primitives";
import "../globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const alexandria = Alexandria({ subsets: ["arabic"], weight: ["300", "400", "500"], variable: "--font-alexandria", display: "swap", preload: false });
const plexArabic = IBM_Plex_Sans_Arabic({ subsets: ["arabic"], weight: ["300", "400", "500", "600"], variable: "--font-plex-arabic", display: "swap", preload: false });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    metadataBase: new URL(business.url),
    applicationName: business.shortName[locale],
    ...buildMetadata({ locale, path: "/" }),
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#F6F3EE",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <html lang={locale} dir={dirOf(locale)} className={`${manrope.variable} ${alexandria.variable} ${plexArabic.variable}`} suppressHydrationWarning style={{ "--notice-h": siteConfig.demoCatalog ? "28px" : "0px" } as React.CSSProperties}>
      <body>
        <Loader />
        <JsonLd data={storeJsonLd(locale)} />
        <I18nProvider locale={locale} dict={dict}>
          <ScrollProgress />
          <Header notice={siteConfig.demoCatalog ? dict.demo.banner : undefined} />
          <main id="main" className="min-h-[70vh]">
            {children}
          </main>
          <Footer locale={locale} />
          <BottomNav />
          <MenuOverlay />
          <SearchOverlay />
          <MiniCart />
          <QuickView />
          <CompareBar />
          <WhatsAppFab />
          <Toast />
          <Cursor />
          <RevealObserver />
          <ScrollLock />
          <RouteChangeReset />
        </I18nProvider>
      </body>
    </html>
  );
}
