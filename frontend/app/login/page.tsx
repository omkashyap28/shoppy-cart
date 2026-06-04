import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/forms";

import { Logo } from "@/components/layout";
import { FieldDescription } from "@/components/ui/field";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="gap- flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-10">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="flex flex-col items-center text-center">
              <CardTitle className="mb-4 text-xl">
                <Logo />
              </CardTitle>
              <CardDescription>Login to Shoppy Cart</CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm />
            </CardContent>
          </Card>
          <FieldDescription className="px-6 text-center">
            By clicking continue, you agree to our{" "}
            <Link href="#">Terms of Service</Link> and{" "}
            <Link href="#">Privacy Policy</Link>.
          </FieldDescription>
        </div>
      </div>
    </div>
  );
}
