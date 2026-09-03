"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyFormSchema } from "@/schemas";
import { apiFetch } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/store";
import { useEffect, useRef, useState } from "react";
import { usePings } from "react-pings";
import Link from "next/link";

export function AffiliateRegister({ redirectUrl }: { redirectUrl: string }) {
  const loading = useAppStore((state) => state.loading);
  const setLoading = useAppStore((state) => state.setLoading);
  const [formOpen, setFormOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const pings = usePings();
  const router = useRouter();

  const form = useForm<z.infer<typeof verifyFormSchema>>({
    resolver: zodResolver(verifyFormSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof verifyFormSchema>) => {
    setLoading(true);

    const { otp } = data;
    try {
      const res = await apiFetch(`/otp/verify`, {
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

      pings.success("OTP verified successfully");
      localStorage.setItem("otpVerified", "true");
      router.push(redirectUrl);
    } catch (e) {
      pings.error("Failed to verify OTP or Invalid OTP");
      console.error(e);
    } finally {
      form.reset({
        otp: "",
      });
      setLoading(false);
    }
  };

  const sendOTP = async () => {
    try {
      setLoading(true);
      form.reset({
        otp: "",
      });

      const res = await apiFetch(`/auth/affiliate`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw Error(`Failed to send OTP: ${res.statusText}`);
      }

      pings.success("OTP sent successfully");
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
      pings.error("Failed to sent OTP");
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
        <Button variant="default" onClick={sendOTP}>
          Send OTP
        </Button>
      </FieldGroup>
    );
  } else {
    return (
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Field className="w-fit">
            <FieldLabel htmlFor="digits-only">Enter OTP</FieldLabel>
            <InputOTP
              id="digits-only"
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS}
              value={form.watch("otp")}
              onChange={(value) => form.setValue("otp", value)}
              disabled={loading}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </Field>
          <Field>
            <Button disabled={loading} type="submit">
              Verify
            </Button>
          </Field>
          <Field>
            {timeLeft > 0 ? (
              <p>Resend OTP in {timeLeft}s</p>
            ) : (
              <Button
                variant="link"
                type="button"
                className="w-fit!"
                onClick={sendOTP}
              >
                Resend OTP
              </Button>
            )}
          </Field>
        </FieldGroup>
        <p className="mt-10 px-8 text-center text-sm text-muted-foreground">
          <strong>Note: </strong>Consumer account is required for seller
          registration. If you dont have consumer account,{" "}
          <Link className="text-foreground underline" href="/register">
            Create from here
          </Link>
        </p>
      </form>
    );
  }
}
