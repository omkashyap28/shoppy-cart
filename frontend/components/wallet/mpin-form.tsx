"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import z from "zod";

import { apiFetch } from "@/lib/utils";
import { mPinScehma } from "@/schemas/wallet-schema";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/field";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";

import { Button } from "../ui/button";
import Link from "next/link";
import { WalletResponse } from "@/types/wallet";

interface SecurityDialogeProps {
  open: boolean;
  setOpen: (state: boolean) => void;
  onSuccess?: (data: WalletResponse) => void;
}

type MPinSchema = z.infer<typeof mPinScehma>;

export function SecurityDialoge({
  open,
  setOpen,
  onSuccess,
}: SecurityDialogeProps) {
  const handleSuccess = (data: WalletResponse) => {
    setOpen(false);
    onSuccess?.(data);
  };

  return (
    <Dialog open={open}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Verify MPIN</DialogTitle>

          <DialogDescription>Confirm your MPIN to use wallet</DialogDescription>
        </DialogHeader>

        <MPinForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}

function MPinForm({ onSuccess }: { onSuccess: (data: WalletResponse) => void }) {
  const [mask, setMask] = useState(true);

  const { control, handleSubmit, reset, setError, setFocus } = useForm<MPinSchema>({
    resolver: zodResolver(mPinScehma),
    defaultValues: {
      mPin: "",
    },
  });

  const validateMPin = useMutation({
    mutationFn: async ({ mPin }: MPinSchema) => {
      const response = await apiFetch("wallet/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mPin }),
      });

      if (response.status === 422) {
        throw new Error("Invalid MPIN");
      }

      if (response.status === 423) {
        throw new Error(
          "Account is temporarily blocked. Try again after a few minutes."
        );
      }

      if (response.status === 500) {
        throw new Error("Server error. Please try again later.");
      }

      if (!response.ok) {
        throw new Error("Something went wrong. Please try again.");
      }

      return response.json();
    },

    onSuccess: (data) => {
      reset();
      onSuccess(data);
    },

    onError: (error) => {
      setError("mPin", {
        type: "server",
        message: error.message,
      });
      setFocus("mPin");
    },
  });

  const handleFormSubmit = (values: MPinSchema) => {
    if (validateMPin.isPending) {
      return;
    }

    validateMPin.mutate(values);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <FieldGroup>
        <Controller
          name="mPin"
          control={control}
          disabled={validateMPin.isPending}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="mPin">Enter MPIN</FieldLabel>
              <FieldContent>
                <div className="flex itmes-center gap-3">
                  <InputOTP
                    {...field}
                    id="mPin"
                    maxLength={4}
                    pattern={REGEXP_ONLY_DIGITS}
                    disabled={validateMPin.isPending}
                    autoFocus
                    onComplete={() => {
                      handleSubmit(handleFormSubmit)();
                    }}
                  >
                    <InputOTPGroup>
                      {Array.from({ length: 4 }, (_, index) => (
                        <InputOTPSlot key={index} index={index} mask={mask} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="rounded-full!"
                    disabled={validateMPin.isPending}
                    onClick={() => setMask((previous) => !previous)}
                    aria-label={mask ? "Show MPIN" : "Hide MPIN"}
                  >
                    {mask ? <Eye /> : <EyeOff />}
                  </Button>
                </div>
                {validateMPin.isPending && <FieldDescription className="text-sm tracking-tight text-muted-foreground">
                  Verifying...
                </FieldDescription>}
              </FieldContent>
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        <Link href="#" className="text-xs w-fit hover:underline text-muted-foreground underline-offset-2">
          Forget MPIN ?
        </Link>
      </FieldGroup>
    </form>
  );
}
