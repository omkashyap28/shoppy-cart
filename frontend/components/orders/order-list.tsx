"use client";

import { useQuery } from "@tanstack/react-query";
import { useAppStore } from "@/store/store";
import { apiFetch } from "@/lib/utils";
import { OrderResponse } from "@/types/order";
import { OrderCard } from "./order-card";
import { Loader } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ShoppingBag, RotateCcw, Package } from "lucide-react";
import Link from "next/link";

export function OrderList() {
  const userId = useAppStore((state) => state.userId);

  const {
    data: orders,
    status,
    refetch,
  } = useQuery<OrderResponse[]>({
    queryKey: ["user-orders", userId],
    queryFn: async () => {
      const res = await apiFetch(`user/${userId}/orders`);
      if (!res.ok) {
        throw new Error("Failed to fetch user orders");
      }
      return await res.json();
    },
    enabled: !!userId,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  if (status === "pending") return <Loader />;

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-12 text-center">
        <p className="mb-3 font-medium text-destructive">
          Failed to load orders.
        </p>
        <Button variant="outline" onClick={() => refetch()}>
          <RotateCcw className="mr-2 size-4" /> Retry
        </Button>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/30 p-12 text-center">
        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
          <Package className="size-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold tracking-tight">No orders yet</h3>
        <p className="mt-1 mb-6 max-w-sm text-sm text-muted-foreground">
          You haven&apos;t placed any orders yet. Discover our top collections
          and shop now!
        </p>
        <Button asChild size="lg">
          <Link href="/products">
            <ShoppingBag className="mr-2 size-4" /> Start Shopping
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {orders.map((order) => (
        <OrderCard key={order.orderId} order={order} />
      ))}
    </div>
  );
}
