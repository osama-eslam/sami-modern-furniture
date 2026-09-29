import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { buildMetadata } from "@/lib/seo";
import { ShopPage } from "@/components/shop/ShopPage";

export async function generateMetadata({ params }: PageProps<"/[locale]/shop/best-sellers">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return buildMetadata({ locale, path: "/shop/best-sellers", title: dict.shop.bestSellersTitle, description: dict.meta.defaultDescription });
}

export default async function Page({ params }: PageProps<"/[locale]/shop/best-sellers">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return <ShopPage locale={locale} collection="best" title={dict.shop.bestSellersTitle} path="/shop/best-sellers" />;
}
