import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Logo } from "@/components/layout";
import { Metadata } from "next";
import { VerifyForm } from "@/forms";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify email to create seller account",
  keywords: [
    "Verify Email",
    "Shoppy Cart",
    "Seller Account",
    "Register Seller",
    "Seller",
    "Account",
    "Verify Email",
  ],
};

export default function AffiliateVerifyEmail() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-10">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="flex flex-col items-center text-center">
              <CardTitle className="mb-4 text-xl">
                <Logo />
              </CardTitle>
              <CardDescription>Verify Your Email</CardDescription>
            </CardHeader>
            <CardContent>
              <VerifyForm redirectUrl="seller/setup" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
