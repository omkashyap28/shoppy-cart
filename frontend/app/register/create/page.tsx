import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Metadata } from "next";
import { CreateAccountForm } from "@/forms/index";
import { Logo } from "@/components/layout";

export const metadata: Metadata = {
  title: "Create Profile",
  description: "Create profile to shoppy cart",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-10">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="flex flex-col items-center text-center">
              <CardTitle className="mb-4 text-xl">
                <Logo />
              </CardTitle>
              <CardDescription>
                <h1 className="text-center text-2xl font-bold text-foreground">
                  Create Profile
                </h1>
                <p className="text-center text-balance text-muted-foreground">
                  Create your account to Shoppt Cart
                </p>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreateAccountForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
