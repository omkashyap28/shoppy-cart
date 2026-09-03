import { AffiliateSetup } from "@/components/affiliate/affiliate-setup";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Verification & Setup",
  description: "Verify email and join the Shoppy Cart affiliate program.",
};

export default function AffiliateVerifyEmailPage() {
  return <AffiliateSetup />;
}
