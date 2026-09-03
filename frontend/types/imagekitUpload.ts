import { UploadResponse } from "@imagekit/next";

export interface ImagekitFile {
  file: File;
  status: "idle" | "success" | "error" | "pending";
  progress: number;
  data?: UploadResponse;
  error?: string;
}

export interface UploadItem {
  id: string;
  file: File;
  progress: number;
  status: "idle" | "success" | "error" | "pending";
  data?: UploadResponse;
  error?: string;
}

export type SelectType = "single" | "multiple";

export type FileType = "image" | "video";

export type ImageType = "avatar" | "products" | "reviews";
