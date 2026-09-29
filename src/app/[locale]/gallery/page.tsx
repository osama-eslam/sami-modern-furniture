import { notFound } from "next/navigation";
import { isLocale, localePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { buildMetadata } from "@/lib/seo";
import { GalleryView } from "@/components/gallery/GalleryView";
import { PageHeader } from "@/components/ui/primitives";

export async function generateMetadata({ params }: PageProps<"/[locale]/gallery">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return buildMetadata({ locale, path: "/gallery", title: dict.gallery.title, description: dict.gallery.body });
}

export default async function GalleryPage({ params }: PageProps<"/[locale]/gallery">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return (
    <>
      <PageHeader
        eyebrow={dict.gallery.eyebrow}
        title={dict.gallery.title}
        body={dict.gallery.body}
        breadcrumbs={[
          { name: dict.nav.home, href: localePath(locale, "/") },
          { name: dict.nav.gallery, href: localePath(locale, "/gallery") },
        ]}
      />
      <GalleryView />
    </>
  );
}
