"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardAction,
} from "@/components/ui/card";
import { ReviewType } from "@/types/review";
import { ReviewHeader } from "./review-header";
import { useTransition } from "react";
import { useAppStore } from "@/store/store";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { usePings } from "react-pings";
import { useRouter } from "next/navigation";
import { ReviewStars } from "./review-stars";
import { serverFetch } from "@/lib/serverFetch";
import { Image } from "@imagekit/next";

interface ReviewCardProps {
  review: ReviewType;
  productId: string;
}

const MAX_VISIBLE_IMAGES = 3;

export function ReviewCard({ review, productId }: ReviewCardProps) {
  const currentUserId = useAppStore((state) => state.userId);
  const accessToken = useAppStore((state) => state.accessToken);

  const [isPending, startTransition] = useTransition();

  const pings = usePings();
  const router = useRouter();

  const handleDelete = (reviewId: string) => {
    startTransition(async () => {
      try {
        await serverFetch(`/product/${productId}/reviews/${reviewId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          revalidate: [
            `reviews:${productId}`,
            `product-reviews-stats:${productId}`,
          ],
          errorMessage: "Failed to delete review",
          validateStatus: 204,
        });

        router.refresh();
      } catch (error) {
        pings.error("Failed to delete review");
        throw error;
      }
    });
  };

  const images = review.reviewImages ?? [];
  const visibleImages = images.slice(0, MAX_VISIBLE_IMAGES);
  const remainingImages = Math.max(images.length - MAX_VISIBLE_IMAGES, 0);

  return (
    <Card className="group relative max-h-fit overflow-hidden border-border/60 hover:shadow-md">
      <CardHeader className="relative border-b border-border/60 pb-4">
        <ReviewHeader
          createdAt={review.createdAt as string}
          edited={review.edited}
          profileImgUrl={review.profileImgUrl}
          username={review.username}
        />

        <CardDescription className="sr-only">
          {review.username} gives {review.rating} out of 5 stars and shares
          their personal experience about this product
        </CardDescription>

        {currentUserId === review.userId && (
          <CardAction>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => handleDelete(review.reviewId)}
              disabled={isPending}
              aria-label="Delete review"
              className="text-muted-foreground opacity-70 transition-all group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
            >
              {isPending ? <Spinner /> : <Trash2 />}
            </Button>
          </CardAction>
        )}
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        <ReviewStars ratings={review.rating} />

        {visibleImages.length > 0 && (
          <div className="flex gap-2 overflow-hidden">
            {visibleImages.map(({ imageId, thumbnailUrl }, index) => {
              const isLastVisible = index === MAX_VISIBLE_IMAGES - 1;
              const showRemainingOverlay = isLastVisible && remainingImages > 0;

              return (
                <div
                  key={imageId}
                  className="relative size-18 shrink-0 overflow-hidden rounded-lg"
                >
                  <Image
                    src={thumbnailUrl}
                    alt={`Review image ${index + 1}`}
                    width={72}
                    height={72}
                    className="size-full object-cover"
                  />

                  {showRemainingOverlay && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/55">
                      <span className="text-sm font-semibold text-white">
                        +{remainingImages}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <p className="wrap-break text-sm leading-6 whitespace-pre-wrap text-foreground/90">
          {review.message}
        </p>
      </CardContent>
    </Card>
  );
}
