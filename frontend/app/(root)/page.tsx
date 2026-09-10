import { Hero, RecentViewed, Recommended, Trendings } from "@/sections/index";
import { Metadata } from "next";
import { Suspense } from "react";
import { Loader } from "@/components/layout";

export const metadata: Metadata = {
  title: "Shop products with great discounts",
  description:
    "Online Shopping Platform for India - Buy mobiles, laptops, cameras, books, watches, apparel, shoes and e-Gift Cards. Free Shipping & Cash on Delivery Available.",
};

export default function Page() {
  return (
    <>
      <Hero />
      <RecentViewed />
      <Recommended />
      <Suspense fallback={<Loader />}>
        <Trendings />
      </Suspense>
    </>
  );
}
