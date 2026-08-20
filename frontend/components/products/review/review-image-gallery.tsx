"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight, Loader2, RotateCcw } from "lucide-react";
import { Image } from "@imagekit/next";
import { Spinner } from "@/components/ui/spinner";
import { ReviewImageType } from "@/types/review";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface ReviewImageGalleryProps {
  images: ReviewImageType[];
  isOpen: boolean;
  onClose: () => void;
  startIndex?: number;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  isFetchNextPageError: boolean;
  refetch: () => void;
  onLoadMore?: () => void;
  loadMoreThreshold?: number;
}

export default function ReviewImageGallery({
  images,
  isOpen,
  onClose,
  startIndex = 0,
  hasMore = false,
  isLoadingMore = false,
  isFetchNextPageError,
  refetch,
  onLoadMore,
  loadMoreThreshold = 2,
}: ReviewImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(startIndex);

  const [emblaMainRef, emblaMainApi] = useEmblaCarousel({
    startIndex,
    loop: false,
    align: "center",
  });

  const [emblaThumbRef, emblaThumbApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
    align: "start",
  });

  const scrollPrev = useCallback(
    () => emblaMainApi?.scrollPrev(),
    [emblaMainApi]
  );
  const scrollNext = useCallback(
    () => emblaMainApi?.scrollNext(),
    [emblaMainApi]
  );

  const onThumbClick = useCallback(
    (index: number) => {
      emblaMainApi?.scrollTo(index);
    },
    [emblaMainApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbApi) return;
    const index = emblaMainApi.selectedScrollSnap();
    setSelectedIndex(index);
    emblaThumbApi.scrollTo(index);

    const remaining = images.length - 1 - index;
    if (
      hasMore &&
      !isLoadingMore &&
      onLoadMore &&
      remaining <= loadMoreThreshold
    ) {
      onLoadMore();
    }
  }, [
    emblaMainApi,
    emblaThumbApi,
    images.length,
    hasMore,
    isLoadingMore,
    onLoadMore,
    loadMoreThreshold,
  ]);

  useEffect(() => {
    if (!emblaMainApi) return;
    (() => onSelect())();
    emblaMainApi.on("select", onSelect);
    emblaMainApi.on("reInit", onSelect);
    return () => {
      emblaMainApi.off("select", onSelect);
      emblaMainApi.off("reInit", onSelect);
    };
  }, [emblaMainApi, onSelect]);

  useEffect(() => {
    emblaMainApi?.reInit();
    emblaThumbApi?.reInit();
  }, [images.length, emblaMainApi, emblaThumbApi]);

  useEffect(() => {
    if (isOpen) emblaMainApi?.scrollTo(startIndex, true);
  }, [isOpen, startIndex, emblaMainApi]);

  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") scrollPrev();
      if (e.key === "ArrowRight") scrollNext();
    };
    window.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose, scrollPrev, scrollNext]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={onClose}
        >
          <motion.div
            className="relative flex max-h-screen w-full flex-col gap-4"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-0 right-0 z-20 rounded-full bg-white/10 p-2 text-white backdrop-blur transition hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>

            <div className="relative w-full overflow-hidden rounded-lg">
              <div className="overflow-hidden" ref={emblaMainRef}>
                <div className="flex">
                  {images.map(({ imageUrl, imageId }, i) => (
                    <div
                      key={imageId}
                      className="relative flex h-[65vh] min-w-0 flex-[0_0_100%] items-center justify-center sm:h-[75vh]"
                    >
                      <Image
                        src={imageUrl}
                        alt={`Review Image ${i + 1}`}
                        draggable={false}
                        fill
                        loading={i === startIndex ? "eager" : "lazy"}
                        priority={i === startIndex}
                        className="object-contain select-none"
                      />
                    </div>
                  ))}

                  {isLoadingMore && (
                    <div className="flex h-[55vh] min-w-0 flex-[0_0_100%] items-center justify-center sm:h-[65vh]">
                      <Spinner />
                    </div>
                  )}
                  {isFetchNextPageError && (
                    <div className="flex h-[55vh] min-w-0 flex-[0_0_100%] items-center justify-center sm:h-[65vh]">
                      <p className="mb-2 text-base tracking-tight text-muted-foreground">
                        Fail to load review images
                      </p>
                      <Button variant="outline" onClick={refetch}>
                        <RotateCcw className="size-4" />
                        Retry
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {selectedIndex > 0 && (
                <button
                  onClick={scrollPrev}
                  aria-label="Previous image"
                  className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-black/50 p-2.5 text-white backdrop-blur transition hover:bg-black/75 sm:left-4"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              )}
              {(selectedIndex < images.length - 1 || isLoadingMore) && (
                <button
                  onClick={scrollNext}
                  aria-label="Next image"
                  className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-black/50 p-2.5 text-white backdrop-blur transition hover:bg-black/75 sm:right-4"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="mx-auto w-full max-w-4xl">
              <div className="overflow-hidden py-1" ref={emblaThumbRef}>
                <div className="flex gap-3">
                  {images.map(({ imageId, thumbnailUrl }, i) => (
                    <button
                      key={imageId}
                      onClick={() => onThumbClick(i)}
                      aria-label={`Go to image ${i + 1}`}
                      aria-current={i === selectedIndex}
                      className={cn(
                        "relative h-16 w-16 min-w-0 flex-[0_0_64px] overflow-hidden rounded-lg border-2 transition sm:h-20 sm:w-20 sm:flex-[0_0_80px]",
                        i === selectedIndex
                          ? "border-primary opacity-100"
                          : "border-transparent brightness-50 hover:brightness-90"
                      )}
                    >
                      <Image
                        src={thumbnailUrl}
                        alt={`Thumbnail image ${i}`}
                        draggable={false}
                        fill
                        loading="eager"
                        priority={i === selectedIndex}
                        className="object-cover object-center"
                      />
                    </button>
                  ))}

                  {isLoadingMore && (
                    <div className="flex h-16 w-16 flex-[0_0_64px] items-center justify-center rounded-lg bg-white/10 sm:h-20 sm:w-20 sm:flex-[0_0_80px]">
                      <Loader2 className="h-5 w-5 animate-spin text-white/70" />
                    </div>
                  )}
                  {isFetchNextPageError && (
                    <div
                      className="flex h-16 w-16 flex-[0_0_64px] items-center justify-center rounded-lg bg-white/10 sm:h-20 sm:w-20 sm:flex-[0_0_80px]"
                      onClick={refetch}
                    >
                      <RotateCcw className="h-5 w-5 text-white/70" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
