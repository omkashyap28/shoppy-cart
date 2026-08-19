"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { WishlistResponse } from "@/types/wishlist";
import { Image } from "@imagekit/next";
import { RatingStar } from "../layout";
import { WishlistButton } from "./wishlist-btn";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

interface WishlistCardProps {
  wishlistItem: WishlistResponse;
  layout: "column" | "row";
}

export function WishlistCard({ wishlistItem, layout }: WishlistCardProps) {
  const {
    brandName,
    description,
    productThumbnail,
    totalReviews,
    averageRating,
    productUrl,
    productAttributes,
    wishlistId,
    coins,
    price,
  } = wishlistItem;

  const isRow = layout === "row";

  return (
    <motion.article
      layout
      transition={{
        duration: 0.2,
        ease: "easeInOut",
      }}
      className="group relative overflow-hidden rounded-2xl border border-border/50 hover:border-border hover:shadow-sm"
    >
      <motion.div
        layout
        transition={{
          duration: 0.2,
          ease: "easeInOut",
        }}
        className={cn(
          "relative grid w-full",
          isRow ? "grid-cols-3 md:grid-cols-3" : "grid-cols-1"
        )}
      >
        <Link href={productUrl} className={cn("w-full", isRow && "col-span-1")}>
          <motion.div
            layout
            className={cn(
              "realtive relative flex shrink-0 items-center justify-center overflow-hidden bg-white",
              isRow ? "h-full w-full" : "aspect-square w-full"
            )}
          >
            <Image
              src={productThumbnail}
              alt={description}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-contain object-center"
            />
          </motion.div>
        </Link>

        <motion.div
          layout
          className={cn(
            "flex min-w-0 flex-1 flex-col justify-between gap-3 p-2 md:p-4",
            isRow ? "col-span-2" : "col-span-1"
          )}
        >
          <div className="flex flex-col gap-2">
            <motion.div layout className="space-y-1">
              <p className="text-sm font-semibold text-muted-foreground">
                {brandName}
              </p>

              <Link href={productUrl}>
                <h3 className="line-clamp-2 text-sm leading-5 font-medium transition-colors hover:underline">
                  {description}
                </h3>
              </Link>
            </motion.div>

            <motion.div layout className="flex items-center gap-2">
              <RatingStar
                rating={averageRating}
                className="size-3.5 text-amber-600 drop-shadow-xs"
              />{" "}
              <span className="text-xs text-muted-foreground">
                ({totalReviews})
              </span>
            </motion.div>

            {productAttributes && Object.keys(productAttributes).length > 0 && (
              <motion.div layout className="flex flex-wrap gap-1.5">
                {Object.entries(productAttributes)
                  .slice(0, 3)
                  .map(([key, value]) => (
                    <span
                      key={key}
                      className="rounded-md border bg-muted/50 px-2 py-1 text-xs text-muted-foreground"
                    >
                      <span className="font-medium text-foreground">
                        {key}:
                      </span>{" "}
                      {String(value)}
                    </span>
                  ))}
              </motion.div>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-base font-bold sm:text-lg">
                ₹{price.toLocaleString()}
              </span>

              {coins > 0 && <Badge variant="outline">{coins} coins</Badge>}
            </div>
          </div>
        </motion.div>
        <motion.div layout className="absolute top-2 right-2">
          <WishlistButton wishlistId={wishlistId} />
        </motion.div>
      </motion.div>
    </motion.article>
  );
}
