import { Logo } from "@/components/layout";
import { VerifyForm } from "@/forms/index";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
                A verification code was just sent to your email.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VerifyForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
