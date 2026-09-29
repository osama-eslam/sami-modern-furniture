import { notFound } from "next/navigation";
import { isLocale, localePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { buildMetadata } from "@/lib/seo";
import { CartView } from "@/components/checkout/CartView";
import { PageHeader } from "@/components/ui/primitives";

export async function generateMetadata({ params }: PageProps<"/[locale]/cart">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return buildMetadata({ locale, path: "/cart", title: getDictionary(locale).cart.title, noindex: true });
}

export default async function CartPage({ params }: PageProps<"/[locale]/cart">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return (
    <>
      <PageHeader eyebrow={dict.cart.eyebrow} title={dict.cart.title} breadcrumbs={[{ name: dict.nav.home, href: localePath(locale) }, { name: dict.nav.cart, href: localePath(locale, "/cart") }]} />
      <CartView />
    </>
  );
}
