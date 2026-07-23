import Link from "next/link";
import { Heart, PackageCheck, Star } from "lucide-react";

import { ProductTags } from "./product-tags";
import { ShareModel } from "@/components/layout";

import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface ProductHeaderProps {
  productId: string;
  brandName: string;
  description: string;
  tags: string[];
  averageRating?: number | string;
  totalReviews: number;
  sellerId: string;
  inStock: boolean;
  price: number;
  coins: number;
}

export function ProductHeader({
  productId,
  brandName,
  description,
  tags,
  averageRating,
  totalReviews,
  sellerId,
  inStock,
  price,
  coins,
}: ProductHeaderProps) {
  return (
    <div className="space-y-5">
      <div className="hidden lg:block space-y-5">
        <ProductTags
          tags={tags}
          variant="secondary"
          className="flex flex-wrap gap-2"
        />

        <Separator />

        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>{brandName}</span>

            <span>•</span>

            <Link
              href={`/seller/${sellerId}`}
              className="font-medium underline-offset-4 hover:underline"
            >
              View Seller
            </Link>
          </div>

          <h1 className="text-xl leading-tight font-semibold tracking-tight lg:text-2xl">
            {description}
          </h1>

          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="size-4 fill-current" />
              <span className="font-semibold text-foreground">
                {averageRating ?? "0.0"}
              </span>
            </div>

            <span className="text-muted-foreground">
              ({totalReviews} Reviews)
            </span>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="flex items-end gap-3">
          <span className="text-4xl font-bold tracking-tight">
            ₹{price.toLocaleString()}
          </span>

          <Badge variant="secondary" className="rounded-full px-3">
            {coins} Coins
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <PackageCheck
            className={`size-4 ${inStock ? "text-green-500" : "text-red-500"}`}
          />

          <span
            className={`text-sm font-medium ${
              inStock ? "text-green-600" : "text-red-500"
            }`}
          >
            {inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          Inclusive of all taxes
        </div>

        <div className="flex items-center gap-2">
          <Toggle variant="outline">
            <Heart className="size-4" />
            Wishlist
          </Toggle>

          <ShareModel
            productTitle={description}
            url={`/product/${productId}`}
          />
        </div>
      </div>
    </div>
  );
}