"use client";

import { useState } from "react";
import { Zap, Loader2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { REGEXP_ONLY_DIGITS } from "input-otp";

import { apiFetch } from "@/lib/utils";

interface ExpressCheckoutCardProps {
  amount: number;
  coins: number;
  productId?: string;
  quantity?: number;
}

type PaymentMethod = "wallet" | "upi";

export function ExpressCheckoutCard({
  amount,
  coins,
  productId,
  quantity = 1,
}: ExpressCheckoutCardProps) {
  const [selected, setSelected] = useState<PaymentMethod>("wallet");

  const [mpinDialogOpen, setMpinDialogOpen] = useState(false);
  const [mpin, setMpin] = useState("");

  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = () => {
    if (!productId) {
      setError("Product information is missing.");
      return;
    }

    switch (selected) {
      case "wallet":
        setError(null);
        setMpin("");
        setMpinDialogOpen(true);
        break;

      case "upi":
        // UPI is currently disabled.
        break;

      default:
        setError("Invalid payment method.");
    }
  };

  const handleWalletPayment = async () => {
    if (mpin.length !== 4 || !productId || isValidating) {
      return;
    }

    try {
      setIsValidating(true);
      setError(null);

      /*
       * Step 1:
       * Validate the user's MPIN.
       */
      const validationResponse = await apiFetch("wallet/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mpin,
        }),
      });

      if (!validationResponse.ok) {
        switch (validationResponse.status) {
          case 422:
            setError("Invalid MPIN.");
            break;

          case 423:
            setError("Wallet is temporarily locked. Please try again later.");
            break;

          default:
            setError("Unable to validate MPIN. Please try again.");
        }

        return;
      }

      /*
       * Step 2:
       * MPIN is valid, now create the payment/order.
       *
       * Change this endpoint/body if your existing backend uses
       * a different wallet-payment endpoint.
       */
      const paymentResponse = await apiFetch("wallet/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity,
          amount,
          coins,
        }),
      });

      if (!paymentResponse.ok) {
        const message =
          paymentResponse.status === 400
            ? "Unable to process wallet payment."
            : paymentResponse.status === 402
              ? "Insufficient wallet balance."
              : "Payment failed. Please try again.";

        setError(message);
        return;
      }

      /*
       * Payment successful.
       *
       * If your backend returns an order/payment ID,
       * use that response here instead of simply closing
       * the dialog.
       */
      setMpin("");
      setMpinDialogOpen(false);

      // Example:
      // const data = await paymentResponse.json();
      // router.push(`/order/${data.orderId}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <>
      <div className="group relative w-full [--border-angle:0deg]">
        <div
          className="animate-border-spin absolute -inset-1 rounded-xl opacity-20 blur-lg"
          style={{
            background:
              "conic-gradient(from var(--border-angle), #372aac, #ffba00, #372aac, #ff0000, #372aac)",
          }}
        />

        <div className="relative w-full overflow-hidden rounded-xl p-0.5">
          <div
            className="animate-border-spin absolute inset-0 rounded-xl"
            style={{
              background:
                "conic-gradient(from var(--border-angle), #372aac, #ffba0099, #372aac99, #ff000099, #372aac)",
            }}
          />

          <Card className="relative w-full rounded-[calc(var(--radius)-0.5px)] border-none shadow-sm backdrop-blur-sm">
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-1.5">
                  <span className="relative flex items-center justify-center">
                    <Zap
                      fill="#ffba00"
                      className="size-4.5 bg-transparent text-amber-400"
                    />
                  </span>

                  Express Checkout
                </div>
              </CardTitle>

              <CardDescription>
                Complete your purchase in a single tap with your defaults.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <RadioGroup
                  value={selected}
                  onValueChange={(value) =>
                    setSelected(value as PaymentMethod)
                  }
                  disabled={isValidating}
                >
                  <div className="flex shrink-0 items-center gap-2">
                    <RadioGroupItem value="wallet" id="wallet" />

                    <Label
                      htmlFor="wallet"
                      className="cursor-pointer text-sm tracking-tight"
                    >
                      Pay with Wallet
                    </Label>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <RadioGroupItem value="upi" id="upi" disabled />

                    <Label
                      htmlFor="upi"
                      className="cursor-not-allowed text-sm tracking-tight opacity-50"
                    >
                      Pay with UPI
                    </Label>
                  </div>
                </RadioGroup>

                {error && !mpinDialogOpen && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <Button
                  className="w-full"
                  onClick={handleCheckout}
                  disabled={!productId || isValidating}
                >
                  <Zap className="mr-1.5 size-4" />
                  Express Checkout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Wallet MPIN Dialog */}
      <Dialog
        open={mpinDialogOpen}
        onOpenChange={(open) => {
          if (isValidating) return;

          setMpinDialogOpen(open);

          if (!open) {
            setMpin("");
            setError(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Enter Wallet MPIN</DialogTitle>

            <DialogDescription>
              Enter your 4-digit MPIN to authorize this payment.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-5 py-4">
            <InputOTP
              maxLength={4}
              value={mpin}
              onChange={(value) => {
                setMpin(value);
                setError(null);
              }}
              pattern={REGEXP_ONLY_DIGITS}
              disabled={isValidating}
              autoFocus
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>

            {error && (
              <p className="w-full text-center text-sm text-destructive">
                {error}
              </p>
            )}

            <Button
              className="w-full"
              disabled={mpin.length !== 4 || isValidating}
              onClick={handleWalletPayment}
            >
              {isValidating ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Pay Now"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}