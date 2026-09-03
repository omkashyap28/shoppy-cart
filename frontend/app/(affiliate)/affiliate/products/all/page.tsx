import { AffiliateProducts } from "@/components/affiliate/affiliate-products";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Products Catalog",
  description: "Browse and add products to your affiliate promotion catalog.",
};

export default function AffiliateProductsAllPage() {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <AffiliateProducts />
    </div>
  );
}
