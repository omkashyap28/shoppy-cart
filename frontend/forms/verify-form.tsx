"use client";

import { Button } from "@/components//ui/button";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useEffect, useRef, useState } from "react";
import { redirect } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyFormSchema } from "@/schemas/index";
import {
  Field,
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
import z from "zod";

export function VerifyForm() {
  const [countdown, setCountdown] = useState(30);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const form = useForm({
    resolver: zodResolver(verifyFormSchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleResend = () => {
    setCountdown(30);

    // Trigger your API call to resend the code here...

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = (data: z.infer<typeof verifyFormSchema>) => {};

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <FieldGroup>
        <Controller
          name="otp"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="digits-only">Verification Code</FieldLabel>
              <InputOTP
                {...field}
                id="digits-only"
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS}
                aria-invalid={fieldState.invalid}
              >
                <InputOTPGroup className="mx-auto w-full">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <FieldError>
                {fieldState.error ? fieldState.error.message : null}
              </FieldError>
            </Field>
          )}
        />

        <Field>
          <Button type="submit">Verfy</Button>
          <FieldDescription>
            <button
              type="button"
              onClick={handleResend}
              disabled={countdown > 0}
              className="text-primary underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
            >
              {countdown > 0 ? `Resend code in ${countdown}s` : "Resend code"}
            </button>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
