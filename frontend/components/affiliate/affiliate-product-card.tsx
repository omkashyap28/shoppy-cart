"use client";

import { useAppStore } from "@/store/store";
import { ShareModel } from "../layout";
import { Share2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Image } from "@imagekit/next";
import { apiFetch } from "@/lib/utils";

interface AffiliateProductCardProps {
  productId: string;
  productThumbnail: string;
  description: string;
}

export function AffiliateProductCard({
  productId,
  productThumbnail,
  description,
}: AffiliateProductCardProps) {
  const affiliateCode = useAppStore((state) => state.affiliateCode);

  if (!affiliateCode) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Earn from product
        </CardTitle>
        <CardDescription>
          Click on below button to share this item with your relatives, friends
          and family to earn.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Image
            src={productThumbnail}
            height={60}
            width={60}
            className="rounded-sm"
            alt={description || "Product Image"}
          />
          <p className="line-clamp-3 text-sm leading-tight">{description}</p>
        </div>
      </CardContent>
      <CardFooter>
        <ShareModel
          productTitle="Hey, checkout this product on Shoppy Cart with exiting deals"
          url={`/products/${productId}?refId=${affiliateCode}`}
          modelTitle="Earn via this product"
          modelDescription="Start your earning just by share this product with your family, friends"
          triggerContent={
            <>
              <Share2 className="size-4" />
              Share to Earn
            </>
          }
          variant="default"
          size="default"
          className="w-full"
        />
      </CardFooter>
    </Card>
  );
}
