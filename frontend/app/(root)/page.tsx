import { Hero } from "@/sections/index";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop products with greate discouts.",
  description:
    "Online Shopping Platform for India - Buy mobiles, laptops, cameras, books, watches, apparel, shoes and e-Gift Cards. Free Shipping & Cash on Delivery Available.",
};

export default function Page() {
  return (
    <>
      <Hero />
    </>
  );
}
