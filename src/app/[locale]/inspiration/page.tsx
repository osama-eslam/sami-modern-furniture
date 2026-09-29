import { notFound } from "next/navigation";
import { isLocale, localePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { buildMetadata } from "@/lib/seo";
import { ArticleList } from "@/components/content/ArticleList";
import { PageHeader } from "@/components/ui/primitives";

export async function generateMetadata({ params }: PageProps<"/[locale]/inspiration">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return buildMetadata({ locale, path: "/inspiration", title: dict.inspiration.title, description: dict.inspiration.body });
}

export default async function InspirationPage({ params }: PageProps<"/[locale]/inspiration">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return (
    <>
      <PageHeader
        eyebrow={dict.inspiration.eyebrow}
        title={dict.inspiration.title}
        body={dict.inspiration.body}
        breadcrumbs={[
          { name: dict.nav.home, href: localePath(locale, "/") },
          { name: dict.nav.inspiration, href: localePath(locale, "/inspiration") },
        ]}
      />
      <ArticleList />
    </>
  );
}
