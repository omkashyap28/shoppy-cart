"use client";

import { ReviewImageType } from "@/types/review";
import { Image } from "@imagekit/next";
import { usePaginationQuery } from "@/hooks/usePaginationQuery";
import { useState } from "react";
import ReviewImageGallery from "./review-image-gallery";
import { Heading3 } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface ReviewImageProps {
  productId: string;
}

export function ReviewImages({ productId }: ReviewImageProps) {
  const [startIndex, setStartIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const {
    response,
    fetchNextPage,
    hasNextPage,
    isFetchNextPageError,
    isFetchingNextPage,
    refetch,
    status,
  } = usePaginationQuery<ReviewImageType>({
    queryKey: ["review-gallery", productId],
    queryFn: async () => {
      try {
        const response = await fetch(
          `/backend/product/${productId}/reviews/images`
        );

        if (!response.ok) {
          throw new Error("Fail to get review images response");
        }
        return await response.json();
      } catch (error) {
        console.error(error);
      }
    },
  });

  if (status === "pending") return;

  const handleClick = (idx: number) => {
    setOpen(true);
    setStartIndex(idx);
  };

  return (
    <div className="px-4 md:px-6">
      <Heading3>Review Images</Heading3>
      <div className="grid grid-cols-4 gap-3">
        {status === "error" || !response ? (
          <div className="relative z-10 flex h-36 w-full items-center justify-center bg-background p-2">
            <p className="mb-2 text-base tracking-tight text-muted-foreground">
              Fail to load review images
            </p>
            <Button variant="outline" onClick={() => refetch()}>
              <RotateCcw className="size-4" />
              Retry
            </Button>
          </div>
        ) : (
          response.map(({ thumbnailUrl }, idx) => (
            <div
              className="relative aspect-square w-full overflow-hidden rounded-md"
              key={idx}
              onClick={() => handleClick(idx)}
            >
              <Image
                src={thumbnailUrl}
                alt={`Review image ${idx}`}
                fill
                loading="eager"
                priority={idx === 1}
                sizes="100%"
                className="object-fit object-center"
              />
            </div>
          ))
        )}
      </div>
      {status === "success" && response && (
        <ReviewImageGallery
          images={response}
          isOpen={open}
          onClose={() => setOpen(false)}
          hasMore={hasNextPage}
          isLoadingMore={isFetchingNextPage}
          isFetchNextPageError={isFetchNextPageError}
          refetch={() => refetch()}
          onLoadMore={fetchNextPage}
          startIndex={startIndex}
        />
      )}
    </div>
  );
}
