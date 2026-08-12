"use cache";

import { Heading2, Loader } from "@/components/layout";
import { ReviewCard } from "./review-card";
import { ReviewResponseType } from "@/types/review";
import { Suspense } from "react";
import { ReviewRatingsStats } from "./review-ratings-stats";
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

  console.log(response);

  return (
    <section id="customer-reviews" className="w-full py-6">
      <Heading2 className="relative border-y border-border bg-background py-2 text-xl md:text-3xl">
        Customer Reviews
      </Heading2>
      <div className="grid gap-5 md:grid-cols-[380px_1fr] md:divide-x md:divide-border md:divide-dashed">
        <div className="h-fit w-full">
          <ReviewRatingsStats productId={productId} />
        </div>
        <div className="@container w-full">
          <Suspense fallback={<Loader />}>
            <div className="grid gap-3 @xl:grid-cols-2 @3xl:grid-cols-3 @5xl:grid-cols-4 @5xl:gap-8">
              {response.content.map((review) => (
                <ReviewCard
                  review={review}
                  key={review.reviewId}
                  productId={productId}
                />
              ))}
            </div>
          </Suspense>
        </div>
      </div>
    </section>
  );
}
