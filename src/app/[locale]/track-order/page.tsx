import { notFound } from "next/navigation";
import { Suspense } from "react";
import { isLocale, localePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { buildMetadata } from "@/lib/seo";
import { TrackOrderView } from "@/components/checkout/TrackOrderView";
import { PageHeader } from "@/components/ui/primitives";

export async function generateMetadata({ params }: PageProps<"/[locale]/track-order">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return buildMetadata({ locale, path: "/track-order", title: dict.track.title, description: dict.track.body });
}

export default async function TrackOrderPage({ params }: PageProps<"/[locale]/track-order">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return (
    <>
      <PageHeader
        eyebrow={dict.track.eyebrow}
        title={dict.track.title}
        body={dict.track.body}
        breadcrumbs={[
          { name: dict.nav.home, href: localePath(locale, "/") },
          { name: dict.nav.trackOrder, href: localePath(locale, "/track-order") },
        ]}
      />
      <Suspense fallback={<div className="container-x min-h-[40vh]" />}>
        <TrackOrderView />
      </Suspense>
    </>
  );
}
