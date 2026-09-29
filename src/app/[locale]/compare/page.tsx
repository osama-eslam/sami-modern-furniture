import { notFound } from "next/navigation";
import { isLocale, localePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { buildMetadata } from "@/lib/seo";
import { CompareView } from "@/components/shop/CompareView";
import { PageHeader } from "@/components/ui/primitives";

export async function generateMetadata({ params }: PageProps<"/[locale]/compare">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return buildMetadata({ locale, path: "/compare", title: getDictionary(locale).compare.title, noindex: true });
}

export default async function ComparePage({ params }: PageProps<"/[locale]/compare">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return (
    <>
      <PageHeader
        eyebrow={dict.compare.eyebrow}
        title={dict.compare.title}
        breadcrumbs={[
          { name: dict.nav.home, href: localePath(locale, "/") },
          { name: dict.nav.compare, href: localePath(locale, "/compare") },
        ]}
      />
      <CompareView />
    </>
  );
}
