import { PolicyPage, policyMetadata } from "@/components/content/PolicyPage";

export const generateMetadata = ({ params }: PageProps<"/[locale]/shipping-policy">) => policyMetadata(params, "shipping-policy");

export default function Page({ params }: PageProps<"/[locale]/shipping-policy">) {
  return <PolicyPage params={params} slug="shipping-policy" />;
}
