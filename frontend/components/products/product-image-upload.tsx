"use client";

import { ImageDrop } from "@/components/layout";
import { useImageKitUpload } from "@/hooks/useImagekitUpload";
import { useEffect } from "react";
import { ProductImageCarousel } from "./products-carosel";
import { filterUploadResponse } from "@/lib/products/filterUploadResponse";
import { UploadedItems } from "@/types/product";

function CircularProgress({ progress }: { progress: number }) {
  const size = 64;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-muted"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="stroke-primary transition-all duration-200 ease-out"
        />
      </svg>
      <span className="absolute text-xs font-medium text-foreground">
        {Math.round(progress)}%
      </span>
    </div>
  );
}

export function ProductImageUpload({
  uploadedItems,
  setUploadedItems,
}: {
  uploadedItems: UploadedItems[];
  setUploadedItems: (uploadedItems: UploadedItems[]) => void;
}) {
  const { fileInputRef, handleUpload, uploading, uploads } = useImageKitUpload({
    fileType: "image",
    selectType: "multiple",
    imageType: "products",
  });

  useEffect(() => {
    if (uploads.length !== 0) {
      const filteredUploads = filterUploadResponse(uploads);

      localStorage.setItem(
        "reviewImages",
        JSON.stringify(filteredUploads)
      );

      setUploadedItems(filteredUploads);
    }
  }, [uploads, setUploadedItems]);

  useEffect(() => {
    const storedImages = localStorage.getItem("reviewImages");
    const parsedStoredImages = JSON.parse(storedImages || "[]");
    if (parsedStoredImages.length !== 0) {
      setUploadedItems(parsedStoredImages);
    }
  }, [setUploadedItems]);

  if (uploadedItems.length === 0) {
    return (
      <div className="w-full space-y-4">
        <ImageDrop
          fileInputRef={fileInputRef}
          handleUpload={handleUpload}
          title="Add Product Images"
          className="w-full"
          disabled={uploading}
        />
        {uploading && uploads.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {uploads.map((item, index) => {
              const progress = Math.min(Math.max(item.progress ?? 0, 0), 100);

              return (
                <div
                  key={item.id ?? index}
                  className="flex flex-col items-center gap-2 rounded-lg border bg-card p-3"
                >
                  <CircularProgress progress={progress} />
                  <span className="w-full truncate text-center text-xs text-muted-foreground">
                    {item.file.name ?? `Image ${index + 1}`}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <ProductImageCarousel
      uploadedItems={uploadedItems}
      setUploadedItems={setUploadedItems}
    />
  );
}