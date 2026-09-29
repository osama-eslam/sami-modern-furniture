import { notFound } from "next/navigation";
import { Suspense } from "react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { buildMetadata } from "@/lib/seo";
import { SuccessView } from "@/components/checkout/SuccessView";

export async function generateMetadata({ params }: PageProps<"/[locale]/checkout/success">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return buildMetadata({ locale, path: "/checkout/success", title: getDictionary(locale).success.eyebrow, noindex: true });
}

export default async function SuccessPage({ params }: PageProps<"/[locale]/checkout/success">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <SuccessView />
    </Suspense>
  );
}
