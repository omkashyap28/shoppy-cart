import { AffiliateSetup } from "@/components/affiliate/affiliate-setup";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Registration",
  description: "Join the Shoppy Cart affiliate partner program.",
};

export default function AffiliateSetupPage() {
  return <AffiliateSetup />;
}
