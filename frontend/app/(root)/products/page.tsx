import { ProductPage } from "@/components/products";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Products | Browse Our Collection",
  description:
    "Explore our full line of high-quality products. Find the best deals and newest arrivals today.",
  keywords: ["products", "shop", "e-commerce", "buy online"],
  openGraph: {
    title: "Products | Browse Our Collection",
    description:
      "Explore our full line of high-quality products. Find the best deals and newest arrivals today.",
    type: "website",
    url: "/products",
  },
  twitter: {
    card: "summary_large_image",
    title: "Products | Browse Our Collection",
    description: "Explore our full line of high-quality products.",
  },
};

export default function ProductsPage() {
  return <ProductPage />;
}
