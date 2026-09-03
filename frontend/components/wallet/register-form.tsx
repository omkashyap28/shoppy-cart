"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";

import { VerifyForm, WalletRegistrationForm } from "@/forms";
import {
  removeItemFromLocalStorage,
  getLocalStorage,
  setLocalStorage,
} from "@/lib/localStorage";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

import { Logo } from "../layout";

const steps = [
  {
    title: "Email Verification",
    description:
      "We'll send a verification code to verify your registered email. To setup your wallet.",
  },
  {
    title: "Set Your MPIN",
    description: "Enter your MPIN to complete your wallet registration.",
  },
];

export function RegsterForm() {
  const [step, setStep] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const currentStep = getLocalStorage("step");

    if (currentStep !== null && currentStep !== undefined) {
      const parsedStep = Number(currentStep);

      if (parsedStep >= 0 && parsedStep < steps.length) {
        (() => setStep(parsedStep))();
        return;
      }
    }

    setLocalStorage("step", 0);
  }, []);

  const handleVerifySuccess = () => {
    setLocalStorage("step", 1);
    setStep(1);
  };

  const handleWalletRegistrationSuccess = () => {
    removeItemFromLocalStorage("step");
    router.push("/wallet");
  };

  return (
    <Card className="max-w-sm ring-transparent">
      <CardHeader>
        <Logo className="mb-5" />

        <CardTitle className="overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={step}
              className="block"
              initial={{
                opacity: 0,
                y: 8,
                filter: "blur(6px)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                y: -8,
                filter: "blur(6px)",
              }}
              transition={{
                duration: 0.25,
              }}
            >
              {steps[step].title}
            </motion.span>
          </AnimatePresence>
        </CardTitle>

        <CardDescription className="overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={step}
              className="block"
              initial={{
                opacity: 0,
                y: 8,
                filter: "blur(6px)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                y: -8,
                filter: "blur(6px)",
              }}
              transition={{
                duration: 0.25,
              }}
            >
              {steps[step].description}
            </motion.p>
          </AnimatePresence>
        </CardDescription>
      </CardHeader>

      <CardContent className="overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{
              opacity: 0,
              y: 8,
              filter: "blur(6px)",
            }}
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
            }}
            exit={{
              opacity: 0,
              y: -8,
              filter: "blur(6px)",
            }}
            transition={{
              duration: 0.25,
            }}
          >
            {step === 0 ? (
              <VerifyForm onSuccess={handleVerifySuccess} />
            ) : (
              <WalletRegistrationForm
                onSuccess={handleWalletRegistrationSuccess}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
