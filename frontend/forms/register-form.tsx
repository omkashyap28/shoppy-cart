"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { registerFormSchema } from "@/schemas/index";
import z from "zod";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { redirect } from "next/navigation";
import { useAppStore } from "@/store/store";
import { Spinner } from "@/components/ui/spinner";
import { usePings } from "react-pings";
import Link from "next/link";

export function RegisterForm() {
  const form = useForm({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const setLoading = useAppStore((state) => state.setLoading);
  const loading = useAppStore((state) => state.loading);
  const pings = usePings();

  const onSubmit = async (data: z.infer<typeof registerFormSchema>) => {
    try {
      setLoading(true);

      const submitData = {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
      };

      const res = await fetch(`/backend/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const responseData = await res.json();

      if (res.status !== 201) {
        console.error("Failed to create account ", responseData.message);
        throw new Error("Failed to create account");
      }

      pings.success("Account created successfully");
      form.reset();
      redirect("/login");
    } catch (e) {
      pings.error("Failed to create account");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field>
          <Button
            variant="outline"
            type="button"
            onClick={() =>
              (window.location.href = `api/auth/login/oauth/google`)
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            Register with Google
          </Button>
        </Field>
        <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
          Or continue with
        </FieldSeparator>

        <Controller
          name="email"
          disabled={loading}
          control={form.control}
          render={({ field, fieldState }) => (
            <Field aria-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">
                Email <span className="text-destructive">*</span>
              </FieldLabel>
              <Input {...field} id="email" placeholder="m@example.com" />
              <FieldError>
                {fieldState.error ? fieldState.error.message : null}
              </FieldError>
            </Field>
          )}
        />
        <Controller
          name="firstName"
          disabled={loading}
          control={form.control}
          render={({ field, fieldState }) => (
            <Field aria-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="first-name">
                First Name <span className="text-destructive">*</span>
              </FieldLabel>
              <Input {...field} id="first-name" placeholder="Hariom" />
              <FieldError>
                {fieldState.error ? fieldState.error.message : null}
              </FieldError>
            </Field>
          )}
        />
        <Controller
          name="password"
          disabled={loading}
          control={form.control}
          render={({ field, fieldState }) => (
            <Field aria-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password">
                Password <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                {...field}
                id="password"
                type="password"
                placeholder="password"
              />
              <FieldError>
                {fieldState.error ? fieldState.error.message : null}
              </FieldError>
            </Field>
          )}
        />
        <Controller
          name="confirmPassword"
          disabled={loading}
          control={form.control}
          render={({ field, fieldState }) => (
            <Field aria-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                {...field}
                id="confirm-password"
                type="password"
                placeholder="password"
              />
              <FieldError>
                {fieldState.error ? fieldState.error.message : null}
              </FieldError>
            </Field>
          )}
        />

        <Field>
          <Button type="submit" disabled={loading} aria-disabled={loading}>
            {loading && <Spinner />} Register
          </Button>
          <FieldDescription className="text-center">
            Already have an account? <Link href="/login">Login</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
