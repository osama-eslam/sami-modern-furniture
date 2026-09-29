import { PolicyPage, policyMetadata } from "@/components/content/PolicyPage";

export const generateMetadata = ({ params }: PageProps<"/[locale]/privacy">) => policyMetadata(params, "privacy");

export default function Page({ params }: PageProps<"/[locale]/privacy">) {
  return <PolicyPage params={params} slug="privacy" />;
}
