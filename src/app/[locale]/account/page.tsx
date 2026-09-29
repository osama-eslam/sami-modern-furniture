import { notFound } from "next/navigation";
import { Suspense } from "react";
import { isLocale, localePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { buildMetadata } from "@/lib/seo";
import { AccountView } from "@/components/account/AccountView";
import { PageHeader } from "@/components/ui/primitives";

export async function generateMetadata({ params }: PageProps<"/[locale]/account">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return buildMetadata({ locale, path: "/account", title: getDictionary(locale).account.title, noindex: true });
}

export default async function AccountPage({ params }: PageProps<"/[locale]/account">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return (
    <>
      <PageHeader
        eyebrow={dict.account.eyebrow}
        title={dict.account.title}
        className="!pb-10 md:!pb-14"
        breadcrumbs={[
          { name: dict.nav.home, href: localePath(locale, "/") },
          { name: dict.nav.account, href: localePath(locale, "/account") },
        ]}
      />
      <Suspense fallback={<div className="container-x min-h-[60vh]" />}>
        <AccountView />
      </Suspense>
    </>
  );
}
