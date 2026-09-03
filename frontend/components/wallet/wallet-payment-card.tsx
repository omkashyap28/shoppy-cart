"use client";

import { Controller, useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { mPinScehma } from "@/schemas/wallet-schema";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/utils";

interface WalletPaymentCardProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess?: () => void;
  paymentId: string;
}

type MPinSchema = z.infer<typeof mPinScehma>

export function WalletPaymentCard({ open, setOpen, onSuccess, paymentId }: WalletPaymentCardProps) {
  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent showCloseButton={false}>
      <DialogHeader>
        <DialogTitle>Pay with Wallet</DialogTitle>
        <DialogDescription>Confirm your MPIN to pay with wallet.</DialogDescription>
      </DialogHeader>
      <WalletPaymentForm onSuccess={onSuccess} paymentId={paymentId} />
    </DialogContent>
  </Dialog>
}

interface WalletPaymentFormProps {
  paymentId: string;
  onSuccess?: () => void;
}

function WalletPaymentForm({ paymentId, onSuccess }: WalletPaymentFormProps) {

  const { handleSubmit, setError, reset, control } = useForm<MPinSchema>({
    resolver: zodResolver(mPinScehma),
    defaultValues: {
      mPin: "",
    },
  })

  const makePayment = useMutation({
    mutationFn: async ({ paymentId, mPin }: { paymentId: string, mPin: string }) => {
      const response = await apiFetch("wallet/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentId, mPin }),
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

    onSuccess: () => {
      reset();
      if (typeof onSuccess !== "undefined") onSuccess();
    },

    onError: (error) => {
      setError("mPin", {
        type: "server",
        message: error.message,
      });
    },
  });

  const handleFormSubmit = ({ mPin }: MPinSchema) => {
    makePayment.mutate({ paymentId, mPin });
  }

  return <form onSubmit={handleSubmit(handleFormSubmit)}>
    <FieldGroup>
      <Controller
        name="mPin"
        control={control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel htmlFor="mPin">
              Enter you MPIN
            </FieldLabel>
            <FieldContent>
              <InputOTP
                {...field}
                id="mPin"
                maxLength={4}
                pattern={REGEXP_ONLY_DIGITS}
                // disabled={validateMPin.isPending}
                autoFocus
              >
                <InputOTPGroup>
                  {Array.from({ length: 4 }).map((_, idx) => (<InputOTPSlot index={idx} key={idx} />))}
                </InputOTPGroup>
              </InputOTP>
            </FieldContent>
            {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
          </Field>
        )}
      />
      <Field>
        <Button type="submit">
          Pay Now
        </Button>
      </Field>
    </FieldGroup>
  </form>
}