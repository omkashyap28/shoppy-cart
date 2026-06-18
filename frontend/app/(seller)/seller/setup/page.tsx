import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Logo } from "@/components/layout";
import { FieldDescription } from "@/components/ui/field";
import Link from "next/link";
import { Metadata } from "next";
import { SellerRegistrationForm } from "@/forms";

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
              <CardDescription>Add Shop Details</CardDescription>
            </CardHeader>
            <CardContent>
              <SellerRegistrationForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
