"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Controller, useForm } from "react-hook-form";
import { walletRegistrationSchema } from "@/schemas/wallet-schema";
import z from "zod";
import { apiFetch } from "@/lib/utils";
import { usePings } from "react-pings";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";

type WalletRegistrationSchema = z.infer<typeof walletRegistrationSchema>;

export function WalletRegistrationForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const pings = usePings();

  const { control, handleSubmit, formState, reset, setValue, setFocus, getValues } =
    useForm<WalletRegistrationSchema>({
      resolver: zodResolver(walletRegistrationSchema),
      defaultValues: {
        mPin: "",
        confirmMPin: "",
      },
    });

  async function onSubmit(data: WalletRegistrationSchema) {
    console.log(data);
    try {
      const payload = {
        mPin: data.mPin,
      };

      const response = await apiFetch(`wallet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.status !== 201) {
        throw new Error("Failed to setup wallet");
      }

      onSuccess();
      reset();
    } catch (error) {
      pings.error("Failed to setup wallet");
      console.error("WALLET SETUP ERROR ", error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="mPin"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="mpin">Enter your MPIN</FieldLabel>
              <InputOTP
                id="mPin"
                maxLength={4}
                pattern={REGEXP_ONLY_DIGITS}
                disabled={formState.isSubmitting}
                {...field}
                autoFocus
                onComplete={() => {
                  setFocus("confirmMPin")
                }}
              >
                <InputOTPGroup>
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <InputOTPSlot index={idx} key={idx} aria-invalid={fieldState.invalid} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
        <Controller
          name="confirmMPin"
          control={control}
          render={({ field, fieldState }) => (
            <Field className="items-center!">
              <FieldLabel htmlFor="confirmMPin">Confirm your MPIN</FieldLabel>
              <InputOTP
                id="confirmMPin"
                maxLength={4}
                pattern={REGEXP_ONLY_DIGITS}
                disabled={formState.isSubmitting}
                {...field}
              >
                <InputOTPGroup>
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <InputOTPSlot index={idx} key={idx} aria-invalid={fieldState.invalid} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
        <Field>
          <Button
            type="submit"
            disabled={!formState.isDirty || formState.isSubmitting}
          >
            {formState.isSubmitting ?
              <>
                <Spinner />
                <span>Settingup...</span>
              </> :
              <span>Setup</span>
            }
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
