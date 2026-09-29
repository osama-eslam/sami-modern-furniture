import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { buildMetadata } from "@/lib/seo";
import { ShopPage } from "@/components/shop/ShopPage";

export async function generateMetadata({ params }: PageProps<"/[locale]/shop/new-arrivals">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return buildMetadata({ locale, path: "/shop/new-arrivals", title: dict.shop.newArrivalsTitle, description: dict.meta.defaultDescription });
}

export default async function Page({ params }: PageProps<"/[locale]/shop/new-arrivals">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return <ShopPage locale={locale} collection="new" title={dict.shop.newArrivalsTitle} path="/shop/new-arrivals" />;
}
