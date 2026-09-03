"use client";

import { WalletResponse } from "@/types/wallet";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Coins,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  ShoppingBag,
  ListOrdered,
  Sparkles,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import Link from "next/link";

interface WalletCardProps {
  wallet: WalletResponse | null;
  onLockWallet?: () => void;
}

export function WalletCard({ wallet, onLockWallet }: WalletCardProps) {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <Card className="relative overflow-hidden border-primary/20 bg-linear-to-br from-card via-card/90 to-primary/5 shadow-xl">
        <div className="pointer-events-none absolute top-0 right-0 p-8 opacity-10">
          <Coins className="size-48 text-primary" />
        </div>

        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl font-bold">
                Shoppy Wallet
              </CardTitle>
              <Badge
                variant="outline"
                className="border-emerald-500/20 bg-emerald-500/10 text-xs font-normal text-emerald-600 dark:text-emerald-400"
              >
                <ShieldCheck className="mr-1 size-3" /> Active
              </Badge>
            </div>
            <CardDescription className="mt-1 font-mono text-xs">
              ID: {wallet ? wallet.walletId : "XXXXXXX"}
            </CardDescription>
          </div>
          {onLockWallet && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onLockWallet}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Lock Wallet
            </Button>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="rounded-2xl border border-primary/20 bg-primary/10 p-6 backdrop-blur-xs dark:bg-primary/15">
            <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Available Coins Balance
            </span>
            <div className="mt-2 flex items-baseline gap-3">
              <Coins className="size-8 animate-pulse text-amber-500" />
              <span className="text-4xl font-extrabold tracking-tight text-foreground">
                {wallet ? wallet.coins.toLocaleString() : "0"}
              </span>
              <span className="text-sm text-muted-foreground">
                Coins (≈ {wallet ? wallet.coins.toLocaleString() : "0"})
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border/80 bg-background/50 p-4 transition-colors hover:border-border">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <ArrowDownLeft className="size-4" />
                <span className="text-xs font-medium tracking-wider uppercase">
                  Total Credits
                </span>
              </div>
              <p className="mt-2 text-2xl font-bold tracking-tight">
                {wallet ? wallet.totalCredits.toLocaleString() : "0"}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Coins earned & refunded
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-background/50 p-4 transition-colors hover:border-border">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                <ArrowUpRight className="size-4" />
                <span className="text-xs font-medium tracking-wider uppercase">
                  Total Debits
                </span>
              </div>
              <p className="mt-2 text-2xl font-bold tracking-tight">
                {wallet ? wallet.totalDebits.toLocaleString() : "0"}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Coins spent on purchases
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border/60 bg-muted/40 p-4">
            <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              <Sparkles className="size-3.5 text-primary" /> Wallet Benefits
            </h4>
            <ul className="list-inside list-disc space-y-1 text-xs text-muted-foreground">
              <li>Instant 1-tap express checkout on all eligible products</li>
              <li>
                Earn coins on every delivered order and affiliate conversion
              </li>
              <li>Zero processing fees and instant refunds on cancellations</li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 sm:flex-row">
          <Button asChild className="w-full sm:flex-1" size="lg">
            <Link href="/products">
              <ShoppingBag className="mr-2 size-4" /> Shop with Coins
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full sm:flex-1"
            size="lg"
          >
            <Link href="/orders">
              <ListOrdered className="mr-2 size-4" /> View Orders
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
