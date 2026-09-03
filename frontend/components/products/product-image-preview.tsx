// product-image-preview.tsx
"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Image } from "@imagekit/next";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { UploadedItems, ProductImage } from "@/types/product";

export function ProductImageFullscreenPreview({
  items,
  open,
  onOpenChange,
  startIndex = 0,
}: {
  items: UploadedItems[] | ProductImage[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  startIndex?: number;
}) {
  const [activeIndex, setActiveIndex] = useState(startIndex);

  useEffect(() => {
    if (open) (() => setActiveIndex(startIndex))();
  }, [open, startIndex]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Escape") onOpenChange(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, activeIndex]);

  function goNext() {
    setActiveIndex((prev) => (prev + 1) % items.length);
  }

  function goPrev() {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  }

  if (items.length === 0) return null;

  const activeItem = items[activeIndex];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="h-screen max-w-screen! min-w-screen! border-none bg-black/95 p-0 sm:rounded-none"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 z-50 text-white hover:bg-white/10 hover:text-white"
        >
          <X className="size-6" />
        </Button>

        <div className="relative flex h-full w-full items-center justify-center">
          {items.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={goPrev}
              className="absolute left-4 z-50 text-white hover:bg-white/10 hover:text-white"
            >
              <ChevronLeft className="size-8" />
            </Button>
          )}

          <div className="relative h-[80vh] w-[80vw]">
            <Image
              src={activeItem.imageUrl}
              alt=""
              fill
              className="object-contain"
            />
          </div>

          {items.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={goNext}
              className="absolute right-4 z-50 text-white hover:bg-white/10 hover:text-white"
            >
              <ChevronRight className="size-8" />
            </Button>
          )}
        </div>

        {items.length > 1 && (
          <div className="absolute bottom-4 left-1/2 z-50 flex -translate-x-1/2 gap-2">
            {items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  idx === activeIndex ? "bg-primary" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
