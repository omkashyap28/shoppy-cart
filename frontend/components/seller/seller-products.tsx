"use client";

import { apiFetch } from "@/lib/utils";
import { useAppStore } from "@/store/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Image } from "@imagekit/next";
import Link from "next/link";
import { useState } from "react";
import { DeleteProduct } from "../products/delete-product";
import { EditProduct } from "../products/edit-product";
import { CircleDollarSign, Pencil } from "lucide-react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

interface SellerProductsType {
  productId: string;
  brandName: string;
  description: string;
  productThumbnail: string;
  sellerId: string;
  inStock: boolean;
  totalReviews: number;
  averageRating: number;
  categoryId: number;
  price: number;
  coins: number;
  productUrl: string;
  tags: string[];
}

export interface EditProductPayload {
  productId: string;
  description: string;
  quantity: number;
}

export function SellerProducts() {
  const sellerId = useAppStore((state) => state.sellerId);
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<{
    productId: string;
    description: string;
    quantity: number;
  } | null>(null);

  const {
    data: sellerProducts,
    error,
    isLoading,

  } = useQuery<SellerProductsType[]>({
    queryKey: ["seller-products", sellerId],
    queryFn: async () => {
      const response = await apiFetch(`seller/${sellerId}/products`);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch seller products: ${response.statusText}`
        );
      }

      return await response.json();
    },
    staleTime: 10 * 60 * 1000,
    enabled: !!sellerId,
  });

  const deleteMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await apiFetch(
        `seller/${sellerId}/products/${productId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete product: ${response.statusText}`);
      }

      return productId;
    },
    onMutate: (productId) => {
      setDeletingId(productId);
    },
    onSuccess: (productId) => {
      queryClient.setQueryData<SellerProductsType[]>(
        ["seller-products", sellerId],
        (old) => old?.filter((p) => p.productId !== productId)
      );
    },
    onSettled: () => {
      setDeletingId(null);
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
        <Spinner className="size-7" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12 text-sm">
        Couldn&apos;t load products. Please try again.
      </div>
    );
  }

  if (!sellerProducts || sellerProducts.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
        No products yet.
      </div>
    );
  }

  return (
    <div className="@container grid grid-cols-2 gap-4 @sm:gap-5 @lg:grid-cols-3 @3xl:grid-cols-4">
      {sellerProducts.map(
        ({
          averageRating,
          brandName,
          coins,
          description,
          productThumbnail,
          inStock,
          price,
          productId,
          productUrl,
          totalReviews,
        }) => {
          const isDeleting = deletingId === productId;

          return (
            <div
              key={productId}
              className="group relative flex flex-col gap-2 overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md"
            >
              <Link href={`${productUrl}`} aria-disabled={isDeleting}>
                <div className="relative aspect-square w-full overflow-hidden bg-muted">
                  <Image
                    src={productThumbnail}
                    alt={description}
                    fill
                    sizes="100%"
                    className="object-cover object-center"
                  />
                  {!inStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <span className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold tracking-wide text-black uppercase">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-0.5 p-2 sm:p-3">
                  <p className="mt-2 truncate text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                    {brandName}
                  </p>
                  <h2 className="line-clamp-2 min-h-10 text-sm font-medium text-foreground">
                    {description}
                  </h2>

                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span className="text-amber-500">★</span>
                    <span>
                      {averageRating?.toFixed(1) ?? "0.0"} ({totalReviews})
                    </span>
                  </div>

                  <div className="mt-1 flex items-center gap-1 text-base font-bold text-foreground">
                    <span className="">₹{price}</span> /
                    {coins > 0 && (
                      <span className="flex items-center gap-0.5">
                        <CircleDollarSign className="size-4" /> {coins}
                      </span>
                    )}
                  </div>
                </div>
              </Link>

              {isDeleting && (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/70 text-xs font-medium text-muted-foreground">
                  Deleting...
                </div>
              )}
              <div className="flex items-center justify-end pr-2 pb-2">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault(); // stops the parent <Link> from navigating
                    e.stopPropagation();
                    setEditingProduct({ productId, description, quantity: 0 });
                  }}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <DeleteProduct
                  deleteAction={() => {
                    deleteMutation.mutate(productId);
                  }}
                />
              </div>
            </div>
          );
        }
      )}
      <EditProduct
        product={editingProduct}
        onClose={() => setEditingProduct(null)}
      />
    </div>
  );
}
