"use client";

import { CartResponse } from "@/types/cart";
import { Image } from "@imagekit/next";
import Link from "next/link";
import { RatingStar, ShareModel } from "../layout";
import { CartItemQuantitySelector } from "./quntity-selector";
import { Badge } from "../ui/badge";
import { Box } from "lucide-react";

interface CartCardProps {
  cartItem: CartResponse;
}

export function CartCard({ cartItem }: CartCardProps) {
  const {
    averageRating,
    brandName,
    coins,
    description,
    inStock,
    price,
    productThumbnail,
    productUrl,
    quantity,
    totalReviews,
  } = cartItem;

  return (
    <div className="items-centerp-3 flex flex-col p-3" title={description}>
      <Link href={productUrl}>
        <div className="group flex max-w-full items-start gap-3">
          <div className="relative size-28 shrink-0 overflow-hidden rounded-md bg-transparent">
            <Image
              src={productThumbnail}
              alt={description}
              fill
              className="object-fit object-center"
            />
          </div>
          <div className="w-full">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs tracking-tight text-muted-foreground">
                {brandName.toUpperCase()}
              </span>
              <div className="flex items-center gap-1">
                <RatingStar
                  rating={averageRating}
                  className="size-3.5 text-amber-400"
                />
                <span className="ml-0.5 text-xs">
                  ({totalReviews.toLocaleString()})
                </span>
              </div>
            </div>
            <p className="line-clamp-2 text-base leading-tight font-semibold tracking-tight text-wrap group-hover:underline">
              {description}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-base font-bold sm:text-lg">
                ₹{price.toLocaleString()}
              </span>

              {coins > 0 && <Badge variant="outline">{coins} coins</Badge>}
            </div>
          </div>
        </div>
      </Link>
      <div className="mt-2 flex w-full items-center justify-between">
        {inStock ? (
          <span className="flex items-center gap-1 text-sm font-semibold tracking-tight text-green-600">
            <Box className="size-3.5" /> In Stock
          </span>
        ) : (
          <span className="text-sm font-semibold tracking-tight text-red-600">
            Out of Stock
          </span>
        )}
        <div className="jusitify-end flex items-center gap-2">
          <ShareModel productTitle={description} url={productUrl} />
          <CartItemQuantitySelector
            cartId={cartItem.cartItemId}
            initialQuantity={quantity}
          />
        </div>
      </div>
    </div>
  );
}
