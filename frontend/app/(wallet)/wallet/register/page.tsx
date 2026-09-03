import { RegsterForm } from "@/components/wallet/register-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wallet Registration",
  description:
    "Register to access our limitless wallet service. Make transactions without leaving the page.",
  keywords: [
    "Verify Email",
    "Shoppy Cart",
    "Wallet Account",
    "Wallet Registration",
    "Wallet",
    "Account",
    "Verify Email",
  ],
};

export default function WalletRegisterForm() {
  return (
    <div className="bg-backgrond/50 flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <RegsterForm />
      </div>
    </div>
  );
}
