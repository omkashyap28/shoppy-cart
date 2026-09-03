"use cache";

import { Field, FieldLabel } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import { serverFetch } from "@/lib/serverFetch";
import { ReviewStatsResponseType } from "@/types/review";
import { Star } from "lucide-react";

interface ReviewRatingsStatsProps {
  productId: string;
}

export async function ReviewRatingsStats({
  productId,
}: ReviewRatingsStatsProps) {
  const response = await serverFetch<ReviewStatsResponseType>(
    `/product/${productId}/reviews/stats`,
    {
      next: {
        tags: [`product-reviews-stats:${productId}`],
      },
    }
  );

  return (
    <div className="p-4 md:p-6">
      <div className="mb-3 flex flex-col items-center justify-center text-center">
        <span className="text-5xl font-extrabold tracking-tight text-foreground">
          {response.averageRating}
        </span>
        <div className="mt-2 flex items-center justify-center gap-1 text-amber-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`size-6 text-amber-400 drop-shadow ${i < Math.round(response.averageRating) && "fill-amber-400"}`}
            />
          ))}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Based on{" "}
          <span className="font-medium text-foreground">
            {response.totalReviews}
          </span>{" "}
          {response.totalReviews === 1 ? "review" : "reviews"}
        </p>
      </div>
      <div className="flex w-full flex-col items-center gap-3">
        {Object.entries(response.ratingDistribution)
          .reverse()
          .map(([rating, count], idx) => (
            <Field key={idx}>
              <FieldLabel className="flex items-center justify-between px-1 text-xs">
                <span>
                  {rating} {Number(rating) === 1 ? "Star" : "Stars"}
                </span>
                <span>{count.toLocaleString()}</span>
              </FieldLabel>
              <Progress
                value={Math.round((count / response.totalReviews) * 100)}
                className="h-2 w-full"
                indicatorClassName="rounded-r-full bg-amber-400"
              />
            </Field>
          ))}
      </div>
    </div>
  );
}
