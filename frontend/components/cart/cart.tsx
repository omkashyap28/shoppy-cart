"use client";

import { useQuery } from "@tanstack/react-query";
import { useAppStore } from "@/store/store";
import { CartResponse } from "@/types/cart";
import { apiFetch } from "@/lib/utils";
import { Loader } from "../layout";
import { Button } from "../ui/button";
import { Compass, RotateCcw } from "lucide-react";
import { CartCard } from "./cart-card";
import { ProceedButton } from "./proceed-btn";
import { useRouter } from "next/navigation";

export function Cart() {
  const userId = useAppStore((state) => state.userId);

  const router = useRouter();

  const {
    data: cartItems,
    refetch,
    status,
  } = useQuery<CartResponse[]>({
    queryKey: ["cart", userId],
    queryFn: async () => {
      const response = await apiFetch(`user/${userId}/cart`);

      if (!response.ok) {
        throw new Error("Failed to get user cart");
      }

      return await response.json();
    },
    enabled: !!userId,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  if (status === "pending") return <Loader />;

  if (status === "error") {
    return (
      <div className="relative z-10 flex h-66 w-full flex-col items-center justify-center rounded-full bg-background/30 p-2">
        <p className="tracking tight mb-4 text-base text-destructive">
          Failed to load cart. Try again!
        </p>
        <Button variant="outline" onClick={() => refetch()}>
          <RotateCcw /> Retry
        </Button>
      </div>
    );
  }

  if (cartItems.length === 0)
    return (
      <div className="relative z-10 flex h-66 w-full flex-col items-center justify-center rounded-full bg-background/30 p-2">
        <p className="tracking tight mb-4 text-base font-normal">
          Nothing exists in your cart
        </p>
        <Button onClick={() => router.push("/products")}>
          <Compass className="size-4" /> Explore Products
        </Button>
      </div>
    );

  return (
    <div className="w-full">
      <div className="w-full divide-y divide-border">
        {cartItems.map((cartItem) => (
          <CartCard cartItem={cartItem} key={cartItem.cartItemId} />
        ))}
      </div>
      <ProceedButton cartItems={cartItems} />
    </div>
  );
}
