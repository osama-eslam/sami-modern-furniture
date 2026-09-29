import { PolicyPage, policyMetadata } from "@/components/content/PolicyPage";

export const generateMetadata = ({ params }: PageProps<"/[locale]/terms">) => policyMetadata(params, "terms");

export default function Page({ params }: PageProps<"/[locale]/terms">) {
  return <PolicyPage params={params} slug="terms" />;
}
