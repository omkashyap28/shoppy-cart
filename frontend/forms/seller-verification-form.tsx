"use client";

import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { sellerVerificationFormSchema } from "@/schemas";
import z from "zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { useAppStore } from "@/store/store";
import { usePings } from "react-pings";
import { apiFetch } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

export function SellerVerificationForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const loading = useAppStore((state) => state.loading);
  const setLoading = useAppStore((state) => state.setLoading);
  const sellerId = useAppStore((state) => state.sellerId);
  const pings = usePings();

  const form = useForm<z.infer<typeof sellerVerificationFormSchema>>({
    resolver: zodResolver(sellerVerificationFormSchema),
    defaultValues: {
      gstNo: "",
      panNo: "",
    },
  });

  const onSubmit = async (
    data: z.infer<typeof sellerVerificationFormSchema>
  ) => {
    const formData = {
      gstNo: data.gstNo,
      panNo: data.panNo,
    };

    try {
      setLoading(true);

      const res = await apiFetch(`seller/${sellerId}/verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Failed to verify seller", data.message);
        throw new Error(data.message);
      }

      pings.success("Seller verified successfully");
      onSuccess();
    } catch (e) {
      pings.error("Verification failed");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="gstNo"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="gstNo">
                GST Number <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                {...field}
                id="gstNo"
                aria-invalid={fieldState.invalid}
                placeholder="GST Number"
              />
              <FieldError>
                {fieldState.error ? fieldState.error.message : null}
              </FieldError>
            </Field>
          )}
        />
        <Controller
          name="panNo"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="panNo">
                Pan Number <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                {...field}
                id="panNo"
                aria-invalid={fieldState.invalid}
                placeholder="PAN Number"
              />
              <FieldError>
                {fieldState.error ? fieldState.error.message : null}
              </FieldError>
            </Field>
          )}
        />
        <Field>
          <Button type="submit" disabled={loading}>
            {loading && <Spinner />} Add Details
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
