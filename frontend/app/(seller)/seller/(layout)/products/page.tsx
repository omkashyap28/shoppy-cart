import { SellerProducts } from "@/components/seller/seller-products";
import { SiteContent } from "@/components/site-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Seller Products",
  description: "Manage your products as a seller",
};

export default function Products() {
  return (
    <SiteContent title="Seller Products">
      <SellerProducts />
    </SiteContent>
  );
}
