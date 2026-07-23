"use client";

import { useState } from "react";
import { Zap } from "lucide-react";
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
import { useAppStore } from "@/store/store";

interface ExpressCheckoutCardProps {
  amount: number;
  coins: number;
}

export function ExpressCheckoutCard({
  amount,
  coins,
}: ExpressCheckoutCardProps) {
  const [selected, setSelected] = useState("wallet");
  const userId = useAppStore(state => state.userId);

  return (
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
              <RadioGroup value={selected} onValueChange={setSelected}>
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
                    className="cursor-pointer text-sm tracking-tight"
                  >
                    Pay with UPI
                  </Label>
                </div>
              </RadioGroup>
                <Button className="w-full">Express Checkout</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
