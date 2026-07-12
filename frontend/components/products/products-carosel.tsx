"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UploadedItems } from "@/types/product";
import { Image } from "@imagekit/next";
import { Fullscreen, GripHorizontal, Trash2 } from "lucide-react";
import { ProductImageFullscreenPreview } from "./product-image-preview";
import { deleteImage } from "@/lib/imagekit/delete";

export function ProductImageCarousel({
  uploadedItems,
  setUploadedItems,
}: {
  uploadedItems: UploadedItems[];
  setUploadedItems: (uploadedItems: UploadedItems[]) => void;
}) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const persist = (items: UploadedItems[]) => {
    setUploadedItems(items);
    localStorage.setItem("uploadProductsImages", JSON.stringify(items));
  };

  const handleSetThumbnail = (imageId: string) => {
    const updated = uploadedItems.map((item) => ({
      ...item,
      isThumbnail: item.imageId === imageId,
    }));
    persist(updated);
  };

  const handleDelete = async (imageId: string) => {
    setDeletingId(imageId);
    try {
      await deleteImage(imageId);

      const wasThumbnail = uploadedItems.find(
        (item) => item.imageId === imageId
      )?.isThumbnail;

      let updated = uploadedItems.filter((item) => item.imageId !== imageId);

      if (wasThumbnail && updated.length > 0) {
        updated = updated.map((item, idx) => ({
          ...item,
          isThumbnail: idx === 0,
        }));
      }

      persist(updated);
    } catch (error) {
      console.error("Failed to delete image:", error);
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
          {uploadedItems.map(({ thumbnailUrl, imageId, isThumbnail }, idx) => (
            <CarouselItem className="basis-auto" key={idx}>
              <div className="relative h-74 w-74">
                <Image
                  src={thumbnailUrl}
                  className="object-fit aspect-auto object-center"
                  alt=""
                  fill
                />
                <label htmlFor={imageId}>
                  <Input
                    type="radio"
                    id={imageId}
                    name="productImage"
                    className="peer hidden"
                    checked={isThumbnail}
                    onChange={() => handleSetThumbnail(imageId)}
                    hidden
                  />
                  <div className="absolute right-2 bottom-2 size-2 rounded-full outline-2 outline-offset-2 outline-primary peer-checked:bg-primary" />
                </label>
                {isThumbnail && (
                  <Badge className="absolute bottom-1 left-1">Thumbnail</Badge>
                )}
                <div className="absolute inset-x-0 top-0 flex w-full items-start justify-end bg-transparent p-1">
                  <div className="flex items-center rounded bg-card">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => {
                            setPreviewIndex(idx);
                            setPreviewOpen(true);
                          }}
                        >
                          <Fullscreen />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <span>Full Screen View</span>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          disabled={deletingId === imageId}
                          onClick={() => handleDelete(imageId)}
                        >
                          <Trash2 className="text-destructive" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <span>Delete Image</span>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext className="mr-6! size-9" />
        <CarouselPrevious className="ml-6! size-9" />
      </Carousel>

      <ProductImageFullscreenPreview
        uploadedItems={uploadedItems}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        startIndex={previewIndex}
      />
    </div>
  );
}