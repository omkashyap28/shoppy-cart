import { UploadedItems } from "@/types/product";
import { UploadItem } from "@/types/imagekitUpload";
import { ReviewImageType } from "@/types/review";

export function filterUploadResponse(uploads: UploadItem[]) {
  const items: UploadedItems[] = [];

  uploads.forEach((upload, idx) => {
    if (upload.data) {
      const { fileId, url, thumbnailUrl } = upload.data;

      items.push({
        imageId: fileId || "",
        imageUrl: url || "",
        thumbnailUrl: thumbnailUrl || "",
        isThumbnail: idx === 0,
        priority: idx,
        altText: "",
      });
    }
  });

  return items;
}

export function filterReviewUploadResponse(uploads: UploadItem[]) {
  const items: ReviewImageType[] = [];

  uploads.forEach((upload) => {
    if (upload.data) {
      const { fileId, url, thumbnailUrl } = upload.data;

      items.push({
        imageId: fileId || "",
        imageUrl: url || "",
        thumbnailUrl: thumbnailUrl || "",
      });
    }
  });

  return items;
}
