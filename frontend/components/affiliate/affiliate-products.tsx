"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppStore } from "@/store/store";
import { apiFetch } from "@/lib/utils";
import { Loader } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePings } from "react-pings";
import {
  Search,
  Plus,
  Check,
  Copy,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { ProductResponseDto } from "@/types/product";

export function AffiliateProducts() {
  const affiliateCode = useAppStore((state) => state.affiliateCode);
  const pings = usePings();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  // Get enrolled products to indicate which ones are already added
  const { data: enrolledProducts } = useQuery<ProductResponseDto[]>({
    queryKey: ["affiliate-products", affiliateCode],
    queryFn: async () => {
      const res = await apiFetch(`affiliate/${affiliateCode}/products`);
      if (!res.ok) return [];
      return await res.json();
    },
    enabled: !!affiliateCode,
  });

  const enrolledProductIds = new Set(
    enrolledProducts?.map((p) => p.productId) || []
  );

  const { data: searchResults, status } = useQuery<ProductResponseDto[]>({
    queryKey: ["affiliate-search-products", searchQuery],
    queryFn: async () => {
      const url = searchQuery.trim()
        ? `search?query=${encodeURIComponent(searchQuery)}`
        : `recent-viewed`;
      const res = await apiFetch(url);
      if (!res.ok) return [];
      return await res.json();
    },
  });

  const addMutation = useMutation({
    mutationFn: async (productId: string) => {
      const res = await apiFetch(`affiliate/${affiliateCode}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (!res.ok) throw new Error("Failed to add product to catalog");
      return await res.json();
    },
    onSuccess: () => {
      pings.success("Product added to affiliate catalog!");
      queryClient.invalidateQueries({
        queryKey: ["affiliate-products", affiliateCode],
      });
    },
    onError: (err: any) => {
      pings.error(err.message || "Could not add product");
    },
  });

  const copyLink = (productId: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/products/${productId}?refId=${affiliateCode}`;
    navigator.clipboard.writeText(url);
    pings.success("Affiliate link copied to clipboard!");
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link href="/affiliate/dashboard">
              <ArrowLeft className="mr-1 size-4" /> Dashboard
            </Link>
          </Button>
          <h2 className="text-xl font-bold">Browse & Add Products</h2>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {status === "pending" ? (
        <Loader />
      ) : !searchResults || searchResults.length === 0 ? (
        <Card className="border-dashed p-12 text-center">
          <p className="text-sm text-muted-foreground">
            No products found for your search.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {searchResults.map((product) => {
            const isEnrolled = enrolledProductIds.has(product.productId);

            return (
              <Card
                key={product.productId}
                className="flex flex-col justify-between overflow-hidden border-border/80"
              >
                <CardContent className="space-y-3 p-4">
                  <div className="relative h-44 overflow-hidden rounded-lg bg-muted">
                    <img
                      src={product.productThumbnail || "/placeholder.jpg"}
                      alt={product.description}
                      className="size-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                      {product.brandName || "Product"}
                    </span>
                    <h4 className="mt-0.5 line-clamp-2 text-sm font-semibold">
                      {product.description}
                    </h4>
                    <p className="mt-1 text-base font-bold text-primary">
                      ₹{product.price}
                    </p>
                  </div>
                </CardContent>

                <div className="mt-auto flex items-center justify-between gap-2 border-t border-border/40 p-4 pt-0">
                  {isEnrolled ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                      onClick={() => copyLink(product.productId)}
                    >
                      <Copy className="mr-1.5 size-3.5" /> Copy Link
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="flex-1"
                      disabled={addMutation.isPending}
                      onClick={() => addMutation.mutate(product.productId)}
                    >
                      <Plus className="mr-1.5 size-3.5" /> Add to Catalog
                    </Button>
                  )}
                  <Button asChild variant="ghost" size="icon-sm">
                    <Link
                      href={`/products/${product.productId}`}
                      target="_blank"
                    >
                      <ExternalLink className="size-4" />
                    </Link>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
