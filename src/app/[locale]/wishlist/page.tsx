import { notFound } from "next/navigation";
import { Suspense } from "react";
import { isLocale, localePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { buildMetadata } from "@/lib/seo";
import { WishlistView } from "@/components/shop/WishlistView";
import { PageHeader } from "@/components/ui/primitives";

export async function generateMetadata({ params }: PageProps<"/[locale]/wishlist">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return buildMetadata({ locale, path: "/wishlist", title: getDictionary(locale).wishlist.title, noindex: true });
}

export default async function WishlistPage({ params }: PageProps<"/[locale]/wishlist">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return (
    <>
      <PageHeader
        eyebrow={dict.wishlist.eyebrow}
        title={dict.wishlist.title}
        breadcrumbs={[
          { name: dict.nav.home, href: localePath(locale, "/") },
          { name: dict.nav.wishlist, href: localePath(locale, "/wishlist") },
        ]}
      />
      <Suspense fallback={<div className="container-x min-h-[50vh]" />}>
        <WishlistView />
      </Suspense>
    </>
  );
}
