"use cache";

import { Heading2, Loader } from "@/components/layout";
import { ReviewCard } from "./review-card";
import { ReviewResponseType } from "@/types/review";
import { Suspense } from "react";
import { ReviewRatingsStats } from "./review-ratings-stats";
import { ReviewImages } from "./review-images";
import { serverFetch } from "@/lib/serverFetch";

interface ReviewProps {
  productId: string;
}

export default async function Review({ productId }: ReviewProps) {
  const response = await serverFetch<ReviewResponseType>(
    `/product/${productId}/reviews`,
    {
      next: {
        tags: [`reviews:${productId}`],
      },
    }
  );

  return (
    <section id="customer-reviews" className="w-full py-6">
      <Heading2 className="relative border-y border-border bg-background py-2 text-xl md:text-3xl">
        Customer Reviews
      </Heading2>
      <div className="grid gap-5 md:grid-cols-[380px_1fr] md:divide-x md:divide-dashed md:divide-border">
        <div className="h-fit w-full">
          <ReviewRatingsStats productId={productId} />
          <ReviewImages productId={productId} />
        </div>
        <div className="@container w-full">
          <Suspense fallback={<Loader />}>
            {response.content.length === 0 ? (
              <div className="flex h-36 w-full items-center justify-center p-2">
                <p className="text-center text-base tracking-tight text-muted-foreground">
                  No reviews exists for this product
                </p>
              </div>
            ) : (
              <div className="columns-1 gap-3 space-y-3 @xl:columns-2 @3xl:columns-3 @5xl:columns-4 @5xl:gap-8 @5xl:space-y-8">
                {response.content.map((review) => (
                  <div key={review.reviewId} className="break-inside-avoid">
                    <ReviewCard review={review} productId={productId} />
                  </div>
                ))}
              </div>
            )}
          </Suspense>
        </div>
      </div>
    </section>
  );
}
