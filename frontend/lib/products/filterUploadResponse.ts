import { UploadedItems } from "@/types/product";
import { UploadItem } from "@/types/imagekitUpload";

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
