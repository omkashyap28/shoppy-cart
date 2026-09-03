import Link from "next/link";
import { PackageCheck, Star } from "lucide-react";

import { ShareModel } from "@/components/layout";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { WishlistButton } from "../layout/wishlist-btn";

interface ProductHeaderProps {
  productId: string;
  brandName: string;
  description: string;
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
  averageRating,
  totalReviews,
  sellerId,
  inStock,
  price,
  coins,
}: ProductHeaderProps) {
  return (
    <div className="space-y-5">
      <div className="hidden space-y-5 xl:block">
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

            <Link href="#customer-reviews" className="text-muted-foreground">
              ({totalReviews} Reviews)
            </Link>
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
          <WishlistButton productId={productId} />
          <ShareModel
            productTitle={description}
            url={`/product/${productId}`}
          />
        </div>
      </div>
    </div>
  );
}
