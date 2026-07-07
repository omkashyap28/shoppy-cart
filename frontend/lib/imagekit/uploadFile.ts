import { upload } from "@imagekit/next";
import { AuthResponse } from "./authenticator";

interface UploadFileParams {
  file: File,
  folder: string,
  auth: AuthResponse
  signal: AbortSignal
  onProgress: (percentage: number) => void,
}

export function uploadFile(
  { file,
    folder,
    auth,
    signal,
    onProgress }: UploadFileParams
) {
  return upload({
    file,
    fileName: file.name,
    useUniqueFileName: true,
    folder,
    token: auth.token,
    expire: auth.expire,
    publicKey: auth.publicKey,
    signature: auth.signature,
    abortSignal: signal,
    onProgress(e) {
      onProgress(
        Math.floor(e.loaded / e.total * 100)
      )
    },
  })
}