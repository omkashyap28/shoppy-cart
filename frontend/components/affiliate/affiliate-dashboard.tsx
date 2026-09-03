"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppStore } from "@/store/store";
import { apiFetch } from "@/lib/utils";
import { Loader } from "@/components/layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePings } from "react-pings";
import {
  DollarSign,
  MousePointerClick,
  TrendingUp,
  Copy,
  Plus,
  Trash2,
  ExternalLink,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { ProductResponseDto } from "@/types/product";

interface AnalyticsResponse {
  totalClicks: number;
  totalConversions: number;
  totalEarnings: number;
}

export function AffiliateDashboard() {
  const affiliateCode = useAppStore((state) => state.affiliateCode);
  const pings = usePings();
  const queryClient = useQueryClient();

  const { data: analytics, status: analyticsStatus } =
    useQuery<AnalyticsResponse>({
      queryKey: ["affiliate-analytics", affiliateCode],
      queryFn: async () => {
        const res = await apiFetch(`affiliate/${affiliateCode}/analytics`);
        if (!res.ok) throw new Error("Failed to fetch analytics");
        return await res.json();
      },
      enabled: !!affiliateCode,
    });

  const { data: products, status: productsStatus } = useQuery<
    ProductResponseDto[]
  >({
    queryKey: ["affiliate-products", affiliateCode],
    queryFn: async () => {
      const res = await apiFetch(`affiliate/${affiliateCode}/products`);
      if (!res.ok) throw new Error("Failed to fetch products");
      return await res.json();
    },
    enabled: !!affiliateCode,
  });

  const deleteMutation = useMutation({
    mutationFn: async (productId: string) => {
      const res = await apiFetch(
        `affiliate/${affiliateCode}/products/${productId}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to remove product");
    },
    onSuccess: () => {
      pings.success("Product removed from affiliate catalog");
      queryClient.invalidateQueries({
        queryKey: ["affiliate-products", affiliateCode],
      });
    },
    onError: (err: any) => {
      pings.error(err.message || "Failed to remove product");
    },
  });

  const copyLink = (productId?: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = productId
      ? `${origin}/products/${productId}?refId=${affiliateCode}`
      : `${origin}/?refId=${affiliateCode}`;
    navigator.clipboard.writeText(url);
    pings.success("Affiliate referral link copied to clipboard!");
  };

  if (!affiliateCode) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-border bg-card p-12 text-center">
        <Sparkles className="mx-auto mb-3 size-10 text-primary" />
        <h3 className="text-xl font-bold">Affiliate Program</h3>
        <p className="mt-2 mb-6 text-sm text-muted-foreground">
          You are not enrolled in the affiliate program yet. Register today to
          start earning commissions!
        </p>
        <Button asChild size="lg">
          <Link href="/affiliate/setup">Join Affiliate Program</Link>
        </Button>
      </div>
    );
  }

  if (analyticsStatus === "pending" || productsStatus === "pending") {
    return <Loader />;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header with Referral Code Box */}
      <div className="flex flex-col gap-4 rounded-2xl border border-primary/20 bg-linear-to-r from-primary/10 via-primary/5 to-transparent p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-semibold tracking-wider text-primary uppercase">
            Your Affiliate Code
          </span>
          <div className="mt-1 flex items-center gap-3">
            <span className="font-mono text-2xl font-extrabold text-foreground">
              {affiliateCode}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyLink()}
              className="border-primary/30 hover:bg-primary/10"
            >
              <Copy className="mr-1.5 size-3.5" /> Copy Store Link
            </Button>
          </div>
        </div>
        <Button asChild size="default">
          <Link href="/products">
            <Plus className="mr-1.5 size-4" /> Add Products
          </Link>
        </Button>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-border/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Earnings
            </CardTitle>
            <DollarSign className="size-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
              ₹{(analytics?.totalEarnings || 0).toLocaleString()}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Earned through conversions
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Link Clicks
            </CardTitle>
            <MousePointerClick className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold tracking-tight">
              {(analytics?.totalClicks || 0).toLocaleString()}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Visits from your referral links
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Conversions
            </CardTitle>
            <TrendingUp className="size-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold tracking-tight">
              {(analytics?.totalConversions || 0).toLocaleString()}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Successful purchases generated
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Enrolled Products Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold tracking-tight">
              Your Enrolled Products
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Promote these products to earn instant commission on orders
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/affiliate/products/all">
              <Plus className="mr-1 size-3.5" /> Browse All Products
            </Link>
          </Button>
        </div>

        {!products || products.length === 0 ? (
          <Card className="border-dashed p-12 text-center">
            <ShoppingBag className="mx-auto mb-3 size-12 text-muted-foreground opacity-60" />
            <h4 className="text-base font-semibold">
              No products in your catalog
            </h4>
            <p className="mt-1 mb-4 text-xs text-muted-foreground">
              Add products from the marketplace to create personalized affiliate
              tracking links.
            </p>
            <Button asChild size="sm">
              <Link href="/affiliate/products/all">
                Add Products to Catalog
              </Link>
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {products.map((item) => (
              <Card
                key={item.productId}
                className="overflow-hidden border-border/80"
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <img
                      src={item.productThumbnail || "/placeholder.jpg"}
                      alt={item.description}
                      className="size-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                      {item.brandName || "Product"}
                    </span>
                    <h4 className="truncate text-sm font-semibold">
                      {item.description}
                    </h4>
                    <p className="text-sm font-bold text-primary">
                      ₹{item.price}
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        variant="secondary"
                        size="xs"
                        onClick={() => copyLink(item.productId)}
                        className="text-xs"
                      >
                        <Copy className="mr-1 size-3" /> Copy Link
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        className="text-destructive hover:bg-destructive/10"
                        disabled={deleteMutation.isPending}
                        onClick={() => deleteMutation.mutate(item.productId)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
