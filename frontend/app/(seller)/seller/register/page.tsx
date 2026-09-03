import { SellerRegister } from "@/components/seller/register-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register Shop",
  description: "Verify email to create shop account",
  keywords: [
    "Verify Email",
    "Shoppy Cart",
    "Shop Account",
    "Register Seller",
    "Seller",
    "Account",
    "Verify Email",
  ],
};

export default function SellerRegisterPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <SellerRegister />
      </div>
    </div>
  );
}
