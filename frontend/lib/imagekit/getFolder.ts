import { FileType, ImageType } from "@/types/imagekitUpload";

export function getFolder(
  fileType: FileType,
  imageType: ImageType
) {
  if (fileType === "image" && imageType === "avatar")
    return "avatar_images";

  if (fileType === "image" && imageType === "products")
    return "product_images";

  if (fileType === "video" && imageType === "products")
    return "product_videos";

  if (fileType === "image" && imageType === "reviews")
    return "review_images";

  if (fileType === "video" && imageType === "reviews")
    return "review_videos";

  return "";
}