"use client";

import {
  ImageKitAbortError,
  ImageKitServerError,
  ImageKitInvalidRequestError,
  ImageKitUploadNetworkError,
} from "@imagekit/next";
import { useRef, useState } from "react";
import {
  FileType,
  ImageType,
  SelectType,
  UploadItem,
} from "@/types/imagekitUpload";
import { authenticate } from "@/lib/imagekit/authenticator";
import { uploadFile } from "@/lib/imagekit/uploadFile";
import { getFolder } from "@/lib/imagekit/getFolder";
import { deleteImage } from "@/lib/imagekit/delete";

interface ImagekitUploadProps {
  selectType: SelectType;
  fileType: FileType;
  imageType: ImageType;
}

export function useImageKitUpload({
  selectType = "single",
  fileType = "image",
  imageType,
}: ImagekitUploadProps) {
  const [uploads, setUploads] = useState<UploadItem[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const controllerRef = useRef(new Map<string, AbortController>());

  const uploading = uploads.some((u) => u.status === "pending");

  const updateUpload = (id: string, values: Partial<UploadItem>) => {
    setUploads((prev) =>
      prev.map((u) =>
        u.id === id
          ? {
              ...u,
              ...values,
            }
          : u
      )
    );
  };

  const uploadOne = async (item: UploadItem) => {
    const controller = new AbortController();

    controllerRef.current.set(item.id, controller);

    updateUpload(item.id, { status: "pending" });

    try {
      console.log("SDasdkjasdkjalsddasd");
      const auth = await authenticate();

      const response = await uploadFile({
        file: item.file,
        folder: getFolder(fileType, imageType),
        auth,
        signal: controller.signal,
        onProgress(progress) {
          updateUpload(item.id, {
            progress,
          });
        },
      });

      console.log("SDasdasd");

      updateUpload(item.id, {
        progress: 100,
        status: "success",
        data: response,
      });
    } catch (e) {
      let errorMessage;
      if (e instanceof ImageKitAbortError) {
        errorMessage = e.message;
      } else if (e instanceof ImageKitServerError) {
        errorMessage = e.message;
      } else if (e instanceof ImageKitInvalidRequestError) {
        errorMessage = e.message;
      } else if (e instanceof ImageKitUploadNetworkError) {
        errorMessage = e.message;
      } else {
        errorMessage = "Something went wrong!!";
      }
      updateUpload(item.id, {
        status: "error",
        error: errorMessage,
      });
    } finally {
      controllerRef.current.delete(item.id);
    }
  };

  const handleUpload = async () => {
    const files = fileInputRef.current?.files;

    if (!files) return;

    const fileList = Array.from(files);

    const selected = selectType === "single" ? fileList.slice(0, 1) : fileList;

    const uploadItems: UploadItem[] = selected.map((file) => ({
      id: crypto.randomUUID(),
      file,
      progress: 0,
      status: "idle",
    }));
    setUploads(uploadItems);

    try {
      await Promise.all(uploadItems.map((item) => uploadOne(item)));
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const retry = async (id: string) => {
    const upload = uploads.find((u) => u.id === id);

    if (!upload) return;

    try {
      uploadOne({
        ...upload,
        status: "idle",
        progress: 0,
        error: "",
      });
    } catch (e) {
      console.error("Fail to upload item", e);
    }
  };

  const abort = (id: string) => {
    controllerRef.current.get(id)?.abort();
    updateUpload(id, {
      status: "error",
      error: "Upload aborted by user",
    });
  };

  const remove = async (id: string) => {
    const upload = uploads.find((u) => u.id === id);

    if (!upload) return;

    abort(id);

    if (upload.data?.fileId) {
      await deleteImage(upload.data.fileId);
    }

    setUploads((prev) => prev.filter((u) => u.id !== id));
  };

  const clear = async () => {
    controllerRef.current.forEach((controller) => controller.abort());
    controllerRef.current.clear();

    await Promise.all(
      uploads
        .filter((u) => u.status === "success")
        .map(async (i) => deleteImage(i.data?.fileId || ""))
    );

    setUploads([]);
  };

  return {
    uploads,
    uploading,
    fileInputRef,
    handleUpload,
    retry,
    abort,
    remove,
    clear,
  };
}
