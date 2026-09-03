"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout";
import { VerifyForm } from "@/forms";
import { apiFetch } from "@/lib/utils";
import { useAppStore } from "@/store/store";
import { usePings } from "react-pings";
import { useRouter } from "next/navigation";
import { Sparkles, DollarSign, CheckCircle2, ArrowRight } from "lucide-react";

export function AffiliateSetup() {
  const [step, setStep] = useState<"verify" | "confirm" | "done">("verify");
  const [affiliateCode, setAffiliateCodeState] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const setAffiliateCode = useAppStore((state) => state.setAffiliateCode);
  const pings = usePings();
  const router = useRouter();

  const handleRegisterAffiliate = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("auth/affiliate/register", {
        method: "POST",
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Failed to register as affiliate");
      }

      const data = await res.json();
      setAffiliateCodeState(data.affiliateCode);
      setAffiliateCode(data.affiliateCode);
      pings.success("Welcome to the Affiliate Program!");
      setStep("done");
    } catch (err: any) {
      pings.error(err.message || "Something went wrong during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card className="border-border/80 shadow-lg">
          <CardHeader className="pb-4 text-center">
            <div className="mb-4 flex justify-center">
              <Logo />
            </div>
            <CardTitle className="text-xl font-bold">
              {step === "verify" && "Verify Your Email"}
              {step === "confirm" && "Become a Shoppy Affiliate"}
              {step === "done" && "You're All Set!"}
            </CardTitle>
            <CardDescription>
              {step === "verify" &&
                "Confirm your identity with a quick OTP verification"}
              {step === "confirm" && "Earn commissions on every sale you refer"}
              {step === "done" && "Your affiliate account is active and ready"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {step === "verify" && (
              <VerifyForm onSuccess={() => setStep("confirm")} />
            )}

            {step === "confirm" && (
              <div className="space-y-6">
                <div className="space-y-3 rounded-xl border border-primary/15 bg-primary/5 p-4">
                  <h4 className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                    <Sparkles className="size-4" /> Program Perks
                  </h4>
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-500" />
                      <span>
                        Earn competitive commission on every purchased item
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-500" />
                      <span>
                        Instant referral tracking with unique shareable links
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-500" />
                      <span>
                        Real-time clicks, conversion and earnings analytics
                      </span>
                    </li>
                  </ul>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  disabled={loading}
                  onClick={handleRegisterAffiliate}
                >
                  {loading ? "Registering..." : "Activate Affiliate Account"}
                </Button>
              </div>
            )}

            {step === "done" && (
              <div className="space-y-6 text-center">
                <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <DollarSign className="size-8" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Your Affiliate Code:
                  </p>
                  <p className="mt-1 font-mono text-lg font-bold tracking-wider text-primary">
                    {affiliateCode}
                  </p>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => router.push("/affiliate/dashboard")}
                >
                  Go to Affiliate Dashboard{" "}
                  <ArrowRight className="ml-1.5 size-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
