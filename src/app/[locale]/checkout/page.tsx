import { notFound } from "next/navigation";
import { deliveryMethods, governorates } from "@/data/config/shipping";
import { isLocale, localePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { buildMetadata } from "@/lib/seo";
import { availablePaymentMethods } from "@/services/payments/registry";
import { CheckoutView } from "@/components/checkout/CheckoutView";
import { PageHeader } from "@/components/ui/primitives";

export async function generateMetadata({ params }: PageProps<"/[locale]/checkout">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return buildMetadata({ locale, path: "/checkout", title: getDictionary(locale).checkout.title, noindex: true });
}

export default async function CheckoutPage({ params }: PageProps<"/[locale]/checkout">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return (
    <>
      <PageHeader
        eyebrow={dict.checkout.eyebrow}
        title={dict.checkout.title}
        className="!pb-8 md:!pb-12"
        breadcrumbs={[
          { name: dict.nav.home, href: localePath(locale, "/") },
          { name: dict.nav.cart, href: localePath(locale, "/cart") },
          { name: dict.checkout.title, href: localePath(locale, "/checkout") },
        ]}
      />
      <CheckoutView payments={availablePaymentMethods()} deliveries={deliveryMethods.filter((d) => d.enabled)} governorates={governorates.filter((g) => g.enabled)} />
    </>
  );
}
