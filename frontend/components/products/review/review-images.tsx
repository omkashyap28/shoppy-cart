import { serverFetch } from "@/lib/serverFetch";
import { cacheTag, cacheLife } from "next/cache"

interface ReviewImageProps {
  productId: string;
}

export async function ReviewImages({productId}: ReviewImageProps) {
  "use cache"
  cacheLife({stale: 300});

  await serverFetch(``, {
    next: {
      tags: [`product-review-images:${productId}`]
    }
  });


}