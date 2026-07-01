import {
  upload,
  ImageKitAbortError,
  ImageKitServerError,
  ImageKitInvalidRequestError,
  ImageKitUploadNetworkError,
  UploadResponse,
} from "@imagekit/next";
import { useRef, useState } from "react";

export function useImageKitUpload() {
  const [progress, setProgress] = useState<number>(0);
  const [data, setData] = useState<UploadResponse>();
  const [uploading, setUploading] = useState<boolean>(false);
  const [status, setStatus] = useState<
    "idle" | "success" | "error" | "pending"
  >("idle");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const abortController = new AbortController();

  const authenticatore = async () => {
    try {
      const response = await fetch("/api/upload-auth");
      if (!response.ok) {
        const errorText = response.text;
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }

      const data = await response.json();
      const { signature, expire, token, publicKey } = data;
      return {
        signature,
        expire,
        token,
        publicKey,
      };
    } catch (error) {
      console.error(`Authentication error: `, error);
      throw new Error(`Authentication request failed`);
    }
  };

  const handleUpload = async () => {
    const fileInput = fileInputRef.current;

    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      return;
    }

    const file = fileInput.files[0];

    let authParams;

    try {
      authParams = await authenticatore();
    } catch (error) {
      console.error(`Failed to authenticate for upload`, error);
      return;
    }

    const { expire, publicKey, signature, token } = authParams;

    try {
      setUploading(true);
      setStatus("pending");

      const uploadResponse = await upload({
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName: file.name,
        folder: "avatar_images",
        onProgress: (e) => {
          setProgress(Math.round((e.loaded / e.total) * 100));
        },
        abortSignal: abortController.signal,
      });

      setStatus("success");
      setData(uploadResponse);
    } catch (error) {
      setStatus("error");
      if (error instanceof ImageKitAbortError) {
        console.error("Upload aborted:", error.reason);
      } else if (error instanceof ImageKitInvalidRequestError) {
        console.error("Invalid request:", error.message);
      } else if (error instanceof ImageKitUploadNetworkError) {
        console.error("Network error:", error.message);
      } else if (error instanceof ImageKitServerError) {
        console.error("Server error:", error.message);
      } else {
        console.error("Upload error:", error);
      }
    } finally {
      setUploading(false);
    }
  };

  return {
    fileInputRef,
    progress,
    handleUpload,
    data,
    uploading,
    status,
  };
}
