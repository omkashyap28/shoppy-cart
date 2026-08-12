"use client";

import { ImageDrop } from "@/components/layout";
import { useImageKitUpload } from "@/hooks/useImagekitUpload";
import { filterReviewUploadResponse } from "@/lib/products/filterUploadResponse";
import { ReviewImageType } from "@/types/review";
import { useEffect } from "react";
import { ReviewImageCarosel } from "./review-image-carosel";

interface ReviewImageUploadProps {
  uploadedImages: ReviewImageType[];
  setUploadedImages: (iamges: ReviewImageType[]) => void;
}

export function ReviewImageUpload({
  uploadedImages,
  setUploadedImages
}: ReviewImageUploadProps) {

  const {
    clear,
    fileInputRef,
    handleUpload,
    remove,
    retry,
    uploading,
    uploads
  } = useImageKitUpload({
    fileType: "image",
    imageType: "reviews",
    selectType: "multiple"
  })

  useEffect(() => {
    if (uploads.length !== 0) {
      const filteredUploads = filterReviewUploadResponse(uploads);

      localStorage.setItem(
        "reviewImages",
        JSON.stringify(filteredUploads)
      );

      setUploadedImages(filteredUploads);
    }
  }, [uploadedImages, setUploadedImages, uploads]);

  useEffect(() => {
    const storedImages = localStorage.getItem("reviewImages");
    const parsedStoredImages = JSON.parse(storedImages || "[]");
    if (parsedStoredImages.length !== 0) {
      setUploadedImages(parsedStoredImages);
    }
  }, [setUploadedImages]);

  if(uploadedImages.length < 1) {
    return (
      <ImageDrop
      fileInputRef={fileInputRef}
      handleUpload={handleUpload}
      title="Upload Review Images"
      disabled={uploading}
      className="border! p-4 mt-0!"
      />
    );
  }

  return <ReviewImageCarosel
    uploadedItems={uploadedImages}
    setUploadedItems={setUploadedImages}
  />
}