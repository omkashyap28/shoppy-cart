"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  SellerRegistrationForm,
  SellerVerificationForm,
  VerifyForm,
} from "@/forms";
import { Logo } from "../layout";
import { Card, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    title: "Verify your Email",
    description: "We'll send a verification code to verify your email address.",
  },
  {
    title: "Shop Information",
    description:
      "Tell us about your business so customers can discover your store.",
  },
  {
    title: "Business Verification",
    description:
      "Submit your GSTIN and PAN details to complete seller onboarding.",
  },
];

export function SellerRegister() {
  const [step, setStep] = useState(0);
  const router = useRouter();

  const progress = Math.floor(((step + 1) / steps.length) * 100);

  useEffect(() => {
    const savedStep = localStorage.getItem("step");
    if (savedStep) {
      (() => setStep(Number(savedStep)))();
    }
  }, []);

  return (
    <Card className="overflow-hidden p-0">
      <CardContent className="grid p-0 md:grid-cols-[320px_1fr]">
        <aside className="hidden border-r border-border bg-muted/30 p-8 md:flex md:flex-col">
          <Logo />

          <div className="mt-12 space-y-8">
            {steps.map((item, index) => {
              const completed = index < step;
              const active = index === step;

              return (
                <div key={item.title} className="relative flex gap-4">
                  {index !== steps.length - 1 && (
                    <div className="absolute top-10 left-5 h-18 w-0.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="bg-primary transition-all duration-500"
                        style={{
                          height: completed ? "100%" : active ? "50%" : "0%",
                        }}
                      />
                    </div>
                  )}
                  <div
                    className={cn(
                      `relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300`,
                      completed
                        ? `border-primary bg-primary text-primary-foreground`
                        : active
                          ? `border-primary bg-background text-primary`
                          : `border-muted-foreground/30 bg-background text-muted-foreground`
                    )}
                  >
                    {completed ? <Check className="size-4" /> : index + 1}
                  </div>
                  <div>
                    <h3
                      className={cn(
                        `font-medium transition-colors`,
                        active
                          ? `text-foreground`
                          : completed
                            ? `text-foreground`
                            : `text-muted-foreground`
                      )}
                    >
                      {item.title}
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        <section className="p-6 lg:p-8">
          <div className="mb-6 flex justify-center md:hidden">
            <Logo />
          </div>

          <div className="mb-6 md:hidden">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span>
                Step {step + 1} of {steps.length}
              </span>
            </div>

            <Progress value={progress} />
          </div>

          <div className="mt-6 mb-8">
            <h2 className="text-3xl font-bold tracking-tight">
              {steps[step].title}
            </h2>

            <p className="mt-2 text-muted-foreground">
              {steps[step].description}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{
                opacity: 0,
                x: 40,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -40,
              }}
              transition={{
                duration: 0.3,
              }}
            >
              {step === 0 && (
                <VerifyForm
                  onSuccess={() => {
                    setStep(1);
                    localStorage.setItem("step", "1");
                  }}
                />
              )}

              {step === 1 && (
                <SellerRegistrationForm
                  onSuccess={() => {
                    setStep(2);
                    localStorage.setItem("step", "2");
                  }}
                />
              )}

              {step === 2 && (
                <SellerVerificationForm
                  onSuccess={() => {
                    router.push("/seller/dashboard");
                    localStorage.removeItem("step");
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </section>
      </CardContent>
    </Card>
  );
}
