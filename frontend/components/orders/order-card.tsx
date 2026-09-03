"use client";

import { OrderResponse } from "@/types/order";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Coins,
  Package,
  ChevronRight,
  Calendar,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

const statusConfig: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    className: string;
  }
> = {
  CREATED: {
    label: "Order Placed",
    variant: "secondary",
    className:
      "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  CONFIRMED: {
    label: "Confirmed",
    variant: "secondary",
    className:
      "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  PROCESSING: {
    label: "Processing",
    variant: "secondary",
    className:
      "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  SHIPPED: {
    label: "Shipped",
    variant: "secondary",
    className:
      "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  },
  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    variant: "secondary",
    className:
      "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
  DELIVERED: {
    label: "Delivered",
    variant: "secondary",
    className:
      "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/20",
  },
  CANCELLED: {
    label: "Cancelled",
    variant: "destructive",
    className: "bg-destructive/15 text-destructive border-destructive/20",
  },
  RETURN_REQUEST: {
    label: "Return Requested",
    variant: "outline",
    className: "border-orange-500 text-orange-600",
  },
  EXCHANGE_REQUEST: {
    label: "Exchange Requested",
    variant: "outline",
    className: "border-orange-500 text-orange-600",
  },
};

export function OrderCard({ order }: { order: OrderResponse }) {
  const status = statusConfig[order.orderStatus] || {
    label: order.orderStatus,
    variant: "secondary",
    className: "bg-muted text-muted-foreground",
  };

  const formattedDate = order.createdAt
    ? format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a")
    : "Recently";

  return (
    <Card className="overflow-hidden border border-border/80 transition-all duration-200 hover:border-primary/40 hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge variant={status.variant} className={status.className}>
                {status.label}
              </Badge>
              <span className="font-mono text-xs text-muted-foreground">
                #{order.orderId}
              </span>
            </div>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="size-3.5" /> Ordered on {formattedDate}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-left sm:text-right">
              <p className="text-lg font-bold tracking-tight">
                ₹{order.amount.toLocaleString()}
              </p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground sm:justify-end">
                <Coins className="size-3 text-amber-500" /> {order.coins} coins
                • Qty: {order.quantity}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/products/${order.productId}`}>
                View Product <ArrowUpRight className="ml-1 size-3.5" />
              </Link>
            </Button>
            {order.orderStatus === "DELIVERED" && (
              <Button asChild variant="ghost" size="sm">
                <Link href={`/products/${order.productId}/reviews/add`}>
                  Write Review
                </Link>
              </Button>
            )}
          </div>

          <Button asChild size="sm">
            <Link href={`/orders/${order.orderId}`}>
              Order Details <ChevronRight className="ml-1 size-3.5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
