"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppStore } from "@/store/store";
import { apiFetch, cn } from "@/lib/utils";
import { Product as ProductType } from "@/types/product";
import { AddressResponse } from "@/types/user";
import { Loader } from "@/components/layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { QuantitySelector } from "@/components/layout/quantity-selector";
import { Image } from "@imagekit/next";
import { usePings } from "react-pings";
import {
  Coins,
  Truck,
  Wallet,
  QrCode,
  MapPin,
  Plus,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { Field, FieldContent, FieldDescription, FieldLabel } from "../ui/field";
import { WalletPaymentCard } from "../wallet/wallet-payment-card";

interface ProductCheckoutProps {
  productId: string;
  product: ProductType;
}

export function ProductCheckout({ productId, product }: ProductCheckoutProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refId = searchParams.get("refId") || undefined;
  const initialQty = Number(searchParams.get("quantity")) || 1;

  const userId = useAppStore((state) => state.userId);
  const pings = usePings();

  const [quantity, setQuantity] = useState(Math.max(1, initialQty));
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<
    "PAY_ON_DELIVERY" | "WALLET" | "UPI"
  >("PAY_ON_DELIVERY");
  const [isMpinOpen, setIsMpinOpen] = useState(false);
  const [pendingPaymentId, setPendingPaymentId] = useState<string | null>(null);

  const { data: addresses, status: addressStatus } = useQuery<
    AddressResponse[]
  >({
    queryKey: ["user-addresses", userId],
    queryFn: async () => {
      const res = await apiFetch(`user/${userId}/address`);
      if (!res.ok) throw new Error("Failed to fetch addresses");
      const data: AddressResponse[] = await res.json();
      if (data.length > 0 && !selectedAddressId) {
        const defaultAddr = data.find((a) => a.isDefault) || data[0];
        setSelectedAddressId(defaultAddr.addressId);
      }
      return data;
    },
    enabled: !!userId,
  });

  const orderMutation = useMutation({
    mutationFn: async () => {
      if (!selectedAddressId) {
        throw new Error("Please select a delivery address");
      }

      const orderUrl = refId
        ? `product/${productId}/order?refId=${refId}`
        : `product/${productId}/order`;

      const orderRes = await apiFetch(orderUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressId: selectedAddressId,
          quantity,
          selectedAttributes: {},
        }),
      });

      if (!orderRes.ok) {
        const err = await orderRes.json().catch(() => ({}));
        throw new Error(err.message || "Failed to place order");
      }

      const orderData = await orderRes.json();

      // Make Payment
      const paymentRes = await apiFetch("payments/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderData.orderId,
          paymentMethod,
        }),
      });

      if (!paymentRes.ok) {
        const err = await paymentRes.json().catch(() => ({}));
        throw new Error(err.message || "Failed to process payment");
      }

      const paymentData = await paymentRes.json();

      return { orderData, paymentData };
    },
    onSuccess: async ({ orderData, paymentData }) => {
      if (
        paymentMethod === "WALLET" &&
        paymentData.paymentStatus === "PENDING"
      ) {
        setPendingPaymentId(paymentData.paymentId);
        setIsMpinOpen(true);
      } else {
        pings.success("Order placed successfully!");
        router.push(`/orders/${orderData.orderId}`);
      }
    },
    onError: (err: any) => {
      pings.error(err.message || "Something went wrong placing your order");
    },
  });

  const handleWalletPaymentSuccess = async () => {
    pings.success("Payment completed with Wallet Coins!");
    setIsMpinOpen(false);
    router.push("/orders");
  };

  if (addressStatus === "pending") return <Loader />;

  const totalPrice = product.price * quantity;
  const totalCoins = product.coins * quantity;

  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-3">
      {/* Left Column: Addresses & Payment */}
      <div className="space-y-6 lg:col-span-2">
        {/* Delivery Address Section */}
        <Card className="border-border/80">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="size-4 text-primary" /> Delivery Address
              </CardTitle>
              <CardDescription className="text-xs">
                Select where you want your order delivered
              </CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/profile">
                <Plus className="mr-1 size-3.5" /> Add Address
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {!addresses || addresses.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-muted/30 p-6 text-center">
                <p className="mb-3 text-sm text-muted-foreground">
                  No delivery addresses saved.
                </p>
                <Button asChild size="sm">
                  <Link href="/profile">Add New Address</Link>
                </Button>
              </div>
            ) : (
              <RadioGroup
                value={selectedAddressId}
                onValueChange={setSelectedAddressId}
                className="space-y-3"
              >
                {addresses.map((addr) => (
                  <Field
                    key={addr.addressId}
                    orientation="horizontal"
                    className={cn("border p-3.5 rounded-xl", selectedAddressId === addr.addressId
                      ? "border-primary bg-primary/5 dark:bg-primary/10"
                      : "border-border/60 hover:border-border"
                    )}
                  >
                    <RadioGroupItem
                      value={addr.addressId}
                      id={addr.addressId}
                    />
                    <FieldContent>
                      <FieldLabel htmlFor={addr.addressId}>
                        {addr.address}
                      </FieldLabel>
                      <FieldDescription>
                        {addr.address}, {addr.street}, {addr.city},{addr.state}-{addr.postalCode}, {addr.country}
                      </FieldDescription>
                    </FieldContent>
                  </Field>
                ))}
              </RadioGroup>
            )}
          </CardContent>
        </Card>

        {/* Payment Method Section */}
        <Card className="border-border/80">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShieldCheck className="size-4 text-primary" /> Payment Method
            </CardTitle>
            <CardDescription className="text-xs">
              Choose your preferred payment method
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(val: any) => setPaymentMethod(val)}
              className="space-y-3"
            >
              <Field
                orientation="horizontal"
                onClick={() => setPaymentMethod("PAY_ON_DELIVERY")}
                className={cn("p-3.5 border rounded-xl cursor-pointer", paymentMethod === "PAY_ON_DELIVERY"
                  ? "border-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10"
                  : "border-border/60 hover:border-border"
                )}
              >
                <RadioGroupItem
                  value="PAY_ON_DELIVERY"
                  id="cod"
                  className="mt-1"
                />
                <FieldContent>
                  <FieldLabel htmlFor="cod">
                    Pay on Delivery (Cash / UPI at doorstep)
                  </FieldLabel>
                  <FieldDescription>
                    Pay securely in cash or via QR code upon delivery.
                  </FieldDescription>
                </FieldContent>
                <Truck className="size-7 text-emerald-500" />
              </Field>
              <Field
                orientation="horizontal"
                onClick={() => setPaymentMethod("WALLET")}
                className={cn("p-3.5 border rounded-xl cursor-pointer", paymentMethod === "WALLET"
                  ? "border-amber-500 bg-amber-500/5 dark:bg-amber-500/10"
                  : "border-border/60 hover:border-border"
                )}
              >
                <RadioGroupItem
                  value="WALLET"
                  id="wallet"
                  className="mt-1"
                />
                <FieldContent>
                  <FieldLabel htmlFor="wallet">
                    Wallet Coins
                  </FieldLabel>
                  <FieldDescription>
                    Instant 1-tap payment using your wallet coin balance (
                    {totalCoins} coins required).
                  </FieldDescription>
                </FieldContent>
                <Wallet className="size-7 text-amber-500" />
              </Field>
              <Field
                orientation="horizontal"
                onClick={() => setPaymentMethod("UPI")}
                className={cn("p-3.5 border rounded-xl cursor-pointer", paymentMethod === "UPI"
                  ? "border-indigo-500 bg-indigo-500/5 dark:bg-indigo-500/10"
                  : "border-border/60 hover:border-border"
                )}
              >
                <RadioGroupItem
                  value="UPI"
                  id="upi"
                  className="mt-1"
                />
                <FieldContent>
                  <FieldLabel htmlFor="upi">
                    UPI / QR Code
                  </FieldLabel>
                  <FieldDescription>
                    Instant online payment via Google Pay, PhonePe, or Paytm.
                  </FieldDescription>
                </FieldContent>
                <QrCode className="size-7 text-indigo-500" />
              </Field>
            </RadioGroup>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Order Summary */}
      <div className="space-y-6">
        <Card className="sticky top-20 border-border/80">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Product Item Preview */}
            <div className="flex items-start gap-3 border-b border-border/60 pb-3">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted">
                <Image
                  src={product.productThumbnail}
                  alt={product.description}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                  {product.brandName || "Store"}
                </span>
                <p className="line-clamp-2 text-xs leading-snug font-medium">
                  {product.description}
                </p>
                <p className="text-xs font-semibold text-foreground">
                  ₹{product.price} / unit
                </p>
              </div>
            </div>

            <QuantitySelector
              quantity={quantity}
              min={1}
              max={10}
              onIncrement={() => setQuantity((q) => q + 1)}
              onDecrement={() => setQuantity((q) => Math.max(1, q - 1))}
            />

            <Separator />

            {/* Price Calculations */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items Total</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Coins Value</span>
                <span className="flex items-center gap-1 font-medium text-amber-500">
                  <Coins className="size-3.5" /> {totalCoins}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  FREE
                </span>
              </div>
            </div>

            <Separator />

            <div className="flex items-baseline justify-between pt-1">
              <span className="text-base font-bold">Total Amount</span>
              <div className="text-right">
                <p className="text-2xl font-extrabold text-primary">
                  ₹{totalPrice.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  or {totalCoins} Wallet Coins
                </p>
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <Button
              className="w-full"
              size="lg"
              disabled={orderMutation.isPending || !selectedAddressId}
              onClick={() => orderMutation.mutate()}
            >
              {orderMutation.isPending ? "Placing Order..." : "Place Order Now"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* MPIN Dialog for Wallet Payment */}
      {pendingPaymentId && (
        <WalletPaymentCard
          open={isMpinOpen}
          setOpen={setIsMpinOpen}
          onSuccess={handleWalletPaymentSuccess}
          paymentId={pendingPaymentId}
        />
      )}
    </div>
  );
}
