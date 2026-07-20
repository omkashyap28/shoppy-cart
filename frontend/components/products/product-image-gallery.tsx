"use client";

import { Image } from "@imagekit/next";
import { ProductImage } from "@/types/product";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";
import { ProductImageFullscreenPreview } from "./product-image-preview";

interface ProductImageGalleryProps {
  productImages: ProductImage[];
  productThumbnail: string;
  description: string;
}

export function ProductImageGallery({
  productImages,
  description,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  const [mainRef, mainApi] = useEmblaCarousel({
    loop: false,
  });

  const [thumbRef, thumbApi] = useEmblaCarousel({
    axis: "x",
    dragFree: true,
    containScroll: "keepSnaps",
    duration: 25,
  });

  useEffect(() => {
    if (!thumbApi) return;

    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleAxisChange = (e: MediaQueryListEvent | MediaQueryList) => {
      thumbApi.reInit({ axis: e.matches ? "y" : "x" });
    };

    handleAxisChange(mediaQuery);

    mediaQuery.addEventListener("change", handleAxisChange);
    return () => mediaQuery.removeEventListener("change", handleAxisChange);
  }, [thumbApi]);

  const onThumbClick = useCallback(
    (index: number) => {
      if (!mainApi) return;
      mainApi.scrollTo(index);
    },
    [mainApi]
  );

  const onSelect = useCallback(() => {
    if (!mainApi || !thumbApi) return;

    const index = mainApi.selectedScrollSnap();
    setSelectedIndex(index);
    thumbApi.scrollTo(index);
  }, [mainApi, thumbApi]);

  useEffect(() => {
    if (!mainApi) return;

    (() => onSelect())();
    mainApi.on("select", onSelect);
    mainApi.on("reInit", onSelect);

    return () => {
      mainApi.off("select", onSelect);
      mainApi.off("reInit", onSelect);
    };
  }, [mainApi, onSelect]);

  return (
    <div className="grid aspect-square w-full gap-4 md:gap-3 lg:grid-cols-[90px_1fr]">
      <div
        className="relative w-full overflow-hidden rounded-xl lg:order-last"
        ref={mainRef}
      >
        <div className="flex">
          {productImages.map((image, idx) => (
            <div
              key={image.imageId}
              className="relative aspect-square w-full flex-[0_0_100%] overflow-hidden rounded-xl"
              onClick={() => {
                setPreviewIndex(idx);
                setPreviewOpen(true);
              }}
            >
              <Image
                src={image.imageUrl}
                alt={image.altText ?? description}
                fill
                sizes="(max-width: 768px) 100vw, 100%"
                className="bg-white object-contain"
                priority
              />
            </div>
          ))}
        </div>
      </div>

      <div className="w-full overflow-hidden lg:order-first" ref={thumbRef}>
        <div className="flex flex-row gap-2.5 px-1 py-0.5 lg:h-120 lg:flex-col">
          {productImages.map((image, index) => (
            <Thumb
              key={image.imageId}
              selected={selectedIndex === index}
              onClick={() => onThumbClick(index)}
              thumbnailUrl={image.thumbnailUrl}
              altText={image.altText}
              description={description}
            />
          ))}
        </div>
      </div>

      <ProductImageFullscreenPreview
        items={productImages}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        startIndex={previewIndex}
      />
    </div>
  );
}

interface ThumbProps {
  selected: boolean;
  onClick: () => void;
  thumbnailUrl: string;
  altText: string | null;
  description: string;
}

function Thumb({
  selected,
  onClick,
  thumbnailUrl,
  altText,
  description,
}: ThumbProps) {
  return (
    <div className="flex-[0_0_auto]">
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "relative h-16 w-16 overflow-hidden rounded-lg border-2 transition-all duration-200 outline-none sm:h-20 sm:w-20",
          selected
            ? "border-primary opacity-100 shadow-sm"
            : "border-transparent brightness-50 hover:brightness-90"
        )}
      >
        <Image
          src={thumbnailUrl}
          fill
          sizes="(max-width: 640px) 64px, 80px"
          alt={altText ?? description}
          className="object-cover"
        />
      </button>
    </div>
  );
}
