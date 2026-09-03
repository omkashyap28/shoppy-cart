"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useForm, Controller } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyFormSchema } from "@/schemas";
import { apiFetch } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/store";
import { useEffect, useRef, useState } from "react";
import { usePings } from "react-pings";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { Mail } from "lucide-react";

export function VerifyForm({ onSuccess }: { onSuccess: () => void }) {
  const loading = useAppStore((state) => state.loading);
  const setLoading = useAppStore((state) => state.setLoading);
  const email = useAppStore((state) => state.user?.email);
  const [formOpen, setFormOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const pings = usePings();

  const form = useForm<z.infer<typeof verifyFormSchema>>({
    resolver: zodResolver(verifyFormSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof verifyFormSchema>) => {
    const { otp } = data;
    try {
      const res = await apiFetch(`otp/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(`Failed to verify: ${responseData.message}`);
      }
      onSuccess();
    } catch (e) {
      form.setError("otp", {
        message: "Invalid OTP! Try again",
      });
      form.setValue("otp", "", { shouldDirty: true });
      form.setFocus("otp");
      console.error(e);
    }
  };

  const sendOTP = async () => {
    setLoading(true);
    try {
      form.reset();

      const res = await apiFetch(`otp/generate`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw Error(`Failed to send OTP: ${res.statusText}`);
      }
      pings.success("OTP send successfully");
      setFormOpen(true);

      // Clear existing timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      form.setError("root", {
        message: "Fail to send otp! Try again.",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  if (!formOpen) {
    return (
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="otpEmail">Email</FieldLabel>
          <InputGroup>
            <InputGroupInput
              type="email"
              placeholder="example@gmail.com"
              disabled
              value={email || ""}
            />
            <InputGroupAddon align="inline-end">
              {!email ? <Spinner /> : <Mail />}
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field>
          <Button variant="default" onClick={sendOTP} disabled={loading}>
            {loading && <Spinner />} Send OTP
          </Button>
        </Field>
        <Field>
          {form.formState.errors.root && (
            <FieldError>{form.formState.errors.root.message}</FieldError>
          )}
          <FieldDescription className="mt-2 text-xs">
            By clicking send OTP, you agree to our terms and conditions.
          </FieldDescription>
        </Field>
      </FieldGroup>
    );
  } else {
    return (
      <FieldGroup>
        <Controller
          name="otp"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="digits-only">Enter OTP</FieldLabel>
              <InputOTP
                id="digits-only"
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS}
                disabled={loading}
                autoFocus
                {...field}
                onComplete={form.handleSubmit(onSubmit)}
              >
                <InputOTPGroup aria-invalid={fieldState.invalid}>
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <InputOTPSlot index={idx} key={idx} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              {form.formState.isSubmitting && (
                <FieldContent>
                  <span className="text-sm font-normal tracking-tight text-muted-foreground">
                    Verifying...
                  </span>
                </FieldContent>
              )}
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
        <Field className="items-end">
          <Button
            variant="outline"
            type="button"
            className="w-fit! text-xs text-muted-foreground"
            onClick={sendOTP}
            disabled={loading || !!timeLeft}
          >
            {timeLeft ? `Resend OTP in ${timeLeft}s` : "Resend OTP"}
          </Button>
        </Field>
      </FieldGroup>
    );
  }
}
