import { PolicyPage, policyMetadata } from "@/components/content/PolicyPage";

export const generateMetadata = ({ params }: PageProps<"/[locale]/returns-policy">) => policyMetadata(params, "returns-policy");

export default function Page({ params }: PageProps<"/[locale]/returns-policy">) {
  return <PolicyPage params={params} slug="returns-policy" />;
}
