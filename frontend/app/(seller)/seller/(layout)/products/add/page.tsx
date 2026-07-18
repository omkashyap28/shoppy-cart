import { Metadata } from "next";
import { SiteContent } from "@/components/site-content";
import { AddProductForm } from "@/forms/add-product-form";

export const metadata: Metadata = {
  title: "Add Products",
  description: "Add new products to your store",
  keywords: ["Add Products", "Products"],
};
export default function Page() {
  return (
    <SiteContent title="Add Products">
      <AddProductForm />
    </SiteContent>
  );
}
