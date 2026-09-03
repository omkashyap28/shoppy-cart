"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppStore } from "@/store/store";
import { apiFetch } from "@/lib/utils";
import { OrderResponse } from "@/types/order";
import { Loader } from "@/components/layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePings } from "react-pings";
import {
  Package,
  Calendar,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
  RefreshCw,
  XCircle,
  Coins,
  ArrowLeft,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const steps = [
  { key: "CREATED", label: "Placed" },
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "PROCESSING", label: "Processing" },
  { key: "SHIPPED", label: "Shipped" },
  { key: "DELIVERED", label: "Delivered" },
];

export function OrderDetail({ orderId }: { orderId: string }) {
  const userId = useAppStore((state) => state.userId);
  const pings = usePings();
  const queryClient = useQueryClient();

  const [dialogAction, setDialogAction] = useState<
    "cancel" | "return" | "exchange" | null
  >(null);

  const {
    data: order,
    status,
    refetch,
  } = useQuery<OrderResponse>({
    queryKey: ["order-detail", userId, orderId],
    queryFn: async () => {
      const res = await apiFetch(`user/${userId}/orders/${orderId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch order details");
      }
      return await res.json();
    },
    enabled: !!userId && !!orderId,
  });

  const cancelMutation = useMutation({
    mutationFn: async () => {
      const res = await apiFetch(
        `user/${userId}/orders/${orderId}/cancellation`,
        {
          method: "PATCH",
        }
      );
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Failed to cancel order");
      }
      return await res.json();
    },
    onSuccess: () => {
      pings.success("Order cancelled successfully");
      setDialogAction(null);
      queryClient.invalidateQueries({
        queryKey: ["order-detail", userId, orderId],
      });
      queryClient.invalidateQueries({ queryKey: ["user-orders", userId] });
    },
    onError: (err: any) => {
      pings.error(err.message || "Could not cancel order");
    },
  });

  const returnMutation = useMutation({
    mutationFn: async () => {
      const res = await apiFetch(`user/${userId}/orders/${orderId}/return`, {
        method: "PATCH",
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Failed to request return");
      }
      return await res.json();
    },
    onSuccess: () => {
      pings.success("Return request submitted successfully");
      setDialogAction(null);
      queryClient.invalidateQueries({
        queryKey: ["order-detail", userId, orderId],
      });
      queryClient.invalidateQueries({ queryKey: ["user-orders", userId] });
    },
    onError: (err: any) => {
      pings.error(err.message || "Could not submit return request");
    },
  });

  const exchangeMutation = useMutation({
    mutationFn: async () => {
      const res = await apiFetch(`user/${userId}/orders/${orderId}/exchange`, {
        method: "PATCH",
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Failed to request exchange");
      }
      return await res.json();
    },
    onSuccess: () => {
      pings.success("Exchange request submitted successfully");
      setDialogAction(null);
      queryClient.invalidateQueries({
        queryKey: ["order-detail", userId, orderId],
      });
      queryClient.invalidateQueries({ queryKey: ["user-orders", userId] });
    },
    onError: (err: any) => {
      pings.error(err.message || "Could not submit exchange request");
    },
  });

  if (status === "pending") return <Loader />;

  if (status === "error" || !order) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-12 text-center">
        <p className="mb-3 font-medium text-destructive">
          Order not found or failed to load.
        </p>
        <Button asChild variant="outline">
          <Link href="/orders">
            <ArrowLeft className="mr-2 size-4" /> Back to Orders
          </Link>
        </Button>
      </div>
    );
  }

  const isCancelled = order.orderStatus === "CANCELLED";
  const isDelivered = order.orderStatus === "DELIVERED";
  const isCancellable =
    order.orderStatus === "CREATED" ||
    order.orderStatus === "CONFIRMED" ||
    order.orderStatus === "PROCESSING";

  const getStepIndex = (status: string) => {
    switch (status) {
      case "CREATED":
        return 0;
      case "CONFIRMED":
        return 1;
      case "PROCESSING":
        return 2;
      case "SHIPPED":
      case "OUT_FOR_DELIVERY":
        return 3;
      case "DELIVERED":
        return 4;
      default:
        return 0;
    }
  };

  const currentStep = getStepIndex(order.orderStatus);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-muted-foreground">
          Order ID: #{order.orderId}
        </span>
      </div>

      {/* Status Banner */}
      <Card className="overflow-hidden border-border/80">
        <CardHeader className="bg-muted/30 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle className="text-lg">Order Status</CardTitle>
              <CardDescription className="mt-0.5 text-xs">
                Placed on{" "}
                {order.createdAt
                  ? format(new Date(order.createdAt), "PPP, p")
                  : "N/A"}
              </CardDescription>
            </div>
            <Badge
              variant={isCancelled ? "destructive" : "secondary"}
              className={
                isCancelled
                  ? "border-destructive/20 bg-destructive/15 text-destructive"
                  : isDelivered
                    ? "border-emerald-500/20 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    : "border-primary/20 bg-primary/15 text-primary"
              }
            >
              {order.orderStatus}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {isCancelled ? (
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-center">
              <XCircle className="mx-auto mb-2 size-8 text-destructive" />
              <p className="text-sm font-semibold text-destructive">
                This order has been cancelled.
              </p>
              {order.cancelledAt && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Cancelled on {format(new Date(order.cancelledAt), "PPP, p")}
                </p>
              )}
            </div>
          ) : (
            <div className="relative flex items-center justify-between py-2">
              <div className="absolute top-1/2 left-0 -z-1 h-0.5 w-full -translate-y-1/2 bg-muted" />
              {steps.map((step, idx) => {
                const isCompleted = idx <= currentStep;
                const isCurrent = idx === currentStep;

                return (
                  <div
                    key={step.key}
                    className="flex flex-col items-center bg-card px-2"
                  >
                    <div
                      className={`flex size-8 items-center justify-center rounded-full border-2 transition-all ${
                        isCompleted
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30 bg-background text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="size-4" />
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <span
                      className={`mt-1.5 text-xs font-medium ${
                        isCurrent
                          ? "font-semibold text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Item Details */}
      <Card className="border-border/80">
        <CardHeader>
          <CardTitle className="text-lg">Item Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-border/60 bg-muted/20 p-4 sm:flex-row">
            <div className="space-y-1">
              <p className="text-base font-semibold">Product Item</p>
              <p className="font-mono text-xs text-muted-foreground">
                Product ID: {order.productId}
              </p>
              <p className="mt-7 text-sm">
                Quantity: <span className="font-medium">{order.quantity}</span>
              </p>
              {order.selectedAttributes &&
                Object.keys(order.selectedAttributes).length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {Object.entries(order.selectedAttributes).map(([k, v]) => (
                      <Badge key={k} variant="outline" className="text-xs">
                        {k}: {v}
                      </Badge>
                    ))}
                  </div>
                )}
            </div>

            <div className="space-y-1 text-left sm:text-right">
              <p className="text-xl font-bold tracking-tight">
                ₹{order.amount.toLocaleString()}
              </p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground sm:justify-end">
                <Coins className="size-3.5 text-amber-500" /> {order.coins}{" "}
                Coins
              </p>
              <Button asChild variant="outline" size="sm" className="mt-6">
                <Link href={`/products/${order.productId}`}>
                  View Product <ExternalLink className="ml-1 size-3.5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            {isCancellable && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setDialogAction("cancel")}
              >
                <XCircle className="mr-1.5 size-4" /> Cancel Order
              </Button>
            )}

            {isDelivered && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDialogAction("return")}
                >
                  <RotateCcw className="mr-1.5 size-4" /> Return Item
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDialogAction("exchange")}
                >
                  <RefreshCw className="mr-1.5 size-4" /> Exchange Item
                </Button>
                <Button asChild size="sm">
                  <Link href={`/products/${order.productId}/reviews/add`}>
                    Write a Review
                  </Link>
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialogs */}
      <Dialog
        open={dialogAction !== null}
        onOpenChange={(open) => !open && setDialogAction(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogAction === "cancel" && "Cancel this order?"}
              {dialogAction === "return" && "Request return for this order?"}
              {dialogAction === "exchange" &&
                "Request exchange for this order?"}
            </DialogTitle>
            <DialogDescription>
              {dialogAction === "cancel" &&
                "Are you sure you want to cancel this order? If you paid using wallet coins, they will be refunded instantly."}
              {dialogAction === "return" &&
                "Are you sure you want to request a return? Our team will review your request within 24 hours."}
              {dialogAction === "exchange" &&
                "Are you sure you want to request an exchange for this item?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogAction(null)}>
              No, keep it
            </Button>
            {dialogAction === "cancel" && (
              <Button
                variant="destructive"
                disabled={cancelMutation.isPending}
                onClick={() => cancelMutation.mutate()}
              >
                {cancelMutation.isPending
                  ? "Cancelling..."
                  : "Yes, Cancel Order"}
              </Button>
            )}
            {dialogAction === "return" && (
              <Button
                disabled={returnMutation.isPending}
                onClick={() => returnMutation.mutate()}
              >
                {returnMutation.isPending
                  ? "Submitting..."
                  : "Submit Return Request"}
              </Button>
            )}
            {dialogAction === "exchange" && (
              <Button
                disabled={exchangeMutation.isPending}
                onClick={() => exchangeMutation.mutate()}
              >
                {exchangeMutation.isPending
                  ? "Submitting..."
                  : "Submit Exchange Request"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
