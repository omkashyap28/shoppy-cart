"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Info, ShoppingCart } from "lucide-react";
import { QuantitySelector } from "../layout/quantity-selector";
import { useState } from "react";
import { apiFetch } from "@/lib/utils";
import { useAppStore } from "@/store/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePings } from "react-pings";
import { AmountTab } from "./amount-tab";
import { Image } from "@imagekit/next";
import { Separator } from "../ui/separator";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { Switch } from "../ui/switch";
import { ExpressCheckoutCard } from "./express-checkout-card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { MagnetButton } from "../layout";
import { Input } from "../ui/input";

interface ProductPurchaseCardProps {
  price: number;
  coins: number;
  inStock: boolean;
  productId: string;
  productThumbnail: string;
  description: string;
}

const MAX_LIMIT = 10;
const MIN_LIMIT = 1;

export function ProductPurchaseCard({
  price,
  coins,
  inStock,
  productId,
  productThumbnail,
  description,
}: ProductPurchaseCardProps) {
  const [quantity, setQuantity] = useState(1);
  const userId = useAppStore((state) => state.user?.userId);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [fastModeEnabled, setFastModeEnabled] = useState(false);
  const [couponCodeValue, setCouponCodeValue] = useState("");

  const queryClient = useQueryClient();
  const pings = usePings();

  const handleIncrement = () => {
    if (quantity < MAX_LIMIT) {
      setQuantity((prev) => prev + 1);
    }
  };
  const handleDecrement = () => {
    if (quantity > MIN_LIMIT) {
      setQuantity((prev) => prev - 1);
    }
  };

  const { mutate: handleAddToCart } = useMutation({
    mutationFn: async () => {
      if (!userId) return;

      const payload = {
        productId,
        quantity,
        selectedAttributes: null,
      };

      const response = await apiFetch(`user/${userId}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.status !== 201) {
        throw new Error("Failed to add product in cart");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-cart-items", userId],
      });
      pings.success("Product added to cart");
    },
    onError: () => {
      pings.error("Failed to add product in cart");
    },
  });

  async function applyCouponCode(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Checkout this Product</CardTitle>
        <CardDescription>
          Get this product for only {price} Ruppes or {coins} Coins.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Image
              src={productThumbnail}
              height={60}
              width={60}
              className="rounded-sm"
              alt={description || "Product Image"}
            />
            <p className="line-clamp-3 text-sm leading-tight">{description}</p>
          </div>
          <Separator />
          <QuantitySelector
            quantity={quantity}
            min={MIN_LIMIT}
            max={MAX_LIMIT}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
          />
          <div className="w-full">
            <div className="mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                Fast Delivery Mode
                <HoverCard openDelay={50} closeDelay={50}>
                  <HoverCardTrigger>
                    <Info className="size-3 text-muted-foreground" />
                  </HoverCardTrigger>
                  <HoverCardContent side="top">
                    Get this product delivered faster. Required extra charges
                    based on the product.
                  </HoverCardContent>
                </HoverCard>
              </span>
              <Switch
                className="cursor-pointer"
                onCheckedChange={setFastModeEnabled}
                checked={fastModeEnabled}
              />
            </div>
            <h4 className="text-sm font-medium text-muted-foreground">
              Astimated delivery on:
            </h4>
            <div className="flex w-full items-baseline justify-between">
              <span>{format(date, "PPPP")}</span>
              <Popover>
                <PopoverTrigger
                  className="text-primary underline-offset-2 hover:underline"
                  disabled={fastModeEnabled}
                >
                  Change
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    defaultMonth={date}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <form
              onSubmit={applyCouponCode}
              className="flex items-center gap-1 rounded-xl border border-border p-1"
            >
              <Input
                placeholder="Enter coupon code"
                value={couponCodeValue}
                onChange={(e) => setCouponCodeValue(e.target.value)}
                required
              />
              <Button type="submit">Apply</Button>
            </form>
          </div>

          <Separator />
          <AmountTab
            productPrice={price}
            productCoins={coins}
            selectedQuantity={quantity}
            fastModeEnabled={fastModeEnabled}
          />
          <ExpressCheckoutCard
            amount={price * quantity}
            coins={coins * quantity}
          />
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full flex-col items-center gap-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleAddToCart()}
          >
            <ShoppingCart className="size-4" />
            Add to Cart
          </Button>
          <MagnetButton magnetStrength={0.15} disabled={!inStock} padding={2}>
            <Button
              className="w-full"
              disabled={!inStock}
              onClick={() => console.log("jkddkshf")}
            >
              Buy Now
            </Button>
          </MagnetButton>
        </div>
      </CardFooter>
    </Card>
  );
}
