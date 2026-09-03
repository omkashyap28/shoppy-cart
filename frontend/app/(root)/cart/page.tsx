import type { Metadata } from "next";
import { Cart } from "@/components/cart/cart";
import { PageComponent } from "@/components/layout";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description:
    "Review the items in your shopping cart, update quantities, remove products, and proceed securely to checkout.",

  keywords: [
    "shopping cart",
    "cart",
    "online shopping",
    "checkout",
    "purchase",
    "order",
  ],

  robots: {
    index: false,
    follow: true,
    nocache: true,
  },

  openGraph: {
    title: "User Cart",
    description:
      "Review the items in your shopping cart and proceed to checkout.",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Shopping Cart",
    description:
      "Review the items in your shopping cart and proceed to checkout.",
  },

  alternates: {
    canonical: "/cart",
  },
};

export default function Page() {
  return (
    <PageComponent heading="Cart">
      <Cart />
    </PageComponent>
  );
}
