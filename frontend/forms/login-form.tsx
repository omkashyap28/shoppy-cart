"use client";

import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { loginFormSchema } from "@/schemas";
import z from "zod";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { contextPath } from "@/lib/utils";
import { redirect } from "next/navigation";
import { useAppStore } from "@/store/store";
import { Spinner } from "@/components/ui/spinner";

export function LoginForm({ }) {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const setAccessToken = useAppStore((state) => state.setAccessToken)
  const setIsAuth = useAppStore((state) => state.setIsAuth)
  const loading = useAppStore(state => state.loading)
  const setLoading = useAppStore(state => state.setLoading)

  const onSubmit = async (data: z.infer<typeof loginFormSchema>) => {
    setLoading(true);

    const formData = {
      email: data.email,
      password: data.password
    }

    const res = await fetch(`${contextPath}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(formData)
    })

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(`Failed to login: ${responseData.message}`)
    }

    form.reset({
      email: "",
      password: ""
    })

    if (!responseData.token) {
      throw new Error(`Token not found`);
    }

    setAccessToken(responseData.token);
    setIsAuth(true);
    setLoading(false);

    redirect("/");

  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field>
          <Button variant="outline" type="button"
            onClick={() => window.location.href = `http://localhost:8080/api/v1/auth/login/oauth/google`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            Login with Google
          </Button>
        </Field>
        <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
          Or continue with
        </FieldSeparator>
        <Controller
          name="email"
          control={form.control}
          disabled={loading}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                {...field}
                id="email"
                aria-invalid={fieldState.invalid}
                placeholder="m@example.com"
              />
              <FieldError>
                {fieldState.error ? fieldState.error.message : null}
              </FieldError>
            </Field>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          disabled={loading}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                type="password"
                {...field}
                id="password"
                aria-invalid={fieldState.invalid}
                placeholder="password"
              />
              <FieldError>
                {fieldState.error ? fieldState.error.message : null}
              </FieldError>
            </Field>
          )}
        />
        <Field>
          <Button type="submit" disabled={loading}>{loading && <Spinner />} Login</Button>
          <FieldDescription className="text-center">
            Don&apos;t have an account? <Link href="/register">Sign up</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
