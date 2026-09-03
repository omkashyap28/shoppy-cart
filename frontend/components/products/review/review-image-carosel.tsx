"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ReviewImageType } from "@/types/review";
import { Image } from "@imagekit/next";
import { Trash2 } from "lucide-react";
import { deleteImage } from "@/lib/imagekit/delete";

export function ReviewImageCarosel({
  uploadedItems,
  setUploadedItems,
}: {
  uploadedItems: ReviewImageType[];
  setUploadedItems: (uploadedItems: ReviewImageType[]) => void;
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const persist = (items: ReviewImageType[]) => {
    setUploadedItems(items);
    localStorage.setItem("reviewImages", JSON.stringify(items));
  };

  const handleDelete = async (imageId: string) => {
    try {
      setDeletingId(imageId);
      await deleteImage(imageId);
      persist(uploadedItems.filter((item) => item.imageId !== imageId));
    } catch (error) {
      console.error("Failed to delete image", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="h-fit w-full">
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        draggable={false}
        className="max-w-full"
      >
        <CarouselContent>
          {uploadedItems.map(({ thumbnailUrl, imageId }, idx) => (
            <CarouselItem
              className="basis-auto overflow-hidden rounded-sm"
              key={idx}
            >
              <div className="relative h-74 w-74">
                <Image
                  src={thumbnailUrl}
                  className="object-fit aspect-auto object-center"
                  alt={`Review image ${idx}`}
                  fill
                />
                <div className="absolute inset-x-0 top-0 flex w-full items-start justify-end bg-transparent p-1">
                  <Tooltip>
                    <TooltipTrigger className="bg-background" asChild>
                      <Button
                        variant="destructive"
                        size="icon-sm"
                        disabled={deletingId === imageId}
                        onClick={() => handleDelete(imageId)}
                      >
                        <Trash2 />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>Remove Image</span>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext type="button" className="ml-5" />
        <CarouselPrevious type="button" className="mr-5" />
      </Carousel>
    </div>
  );
}
