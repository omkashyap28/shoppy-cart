"use client";

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { useImageKitUpload } from "@/hooks/useImagekitUpload";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/utils";
import { AvatarSkeleton } from "@/components/sekeleton/avatar-skeleton";

export function AvatarCard({
  userId,
  avatarUrl,
  fileId,
  firstName,
  lastName,
  email,
}: {
  userId: string;
  avatarUrl: string | null;
  fileId: string | null;
  firstName: string;
  lastName: string | null;
  email: string;
}) {
  const [fullScreenPreview, setFullScreenPreview] = useState(false);
  const [existingFileId, setFileId] = useState<string | null>(null);
  const { fileInputRef, handleUpload, progress, data, uploading, status } =
    useImageKitUpload({
      imageType: "avatars",
      selectType: "single",
      fileType: "image",
    });

    useEffect(() => {
      (() => {
        setFileId(fileId);
      })();
    }, [fileId]);

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async ({
      avatarUrl,
      fileId,
    }: {
      avatarUrl: string;
      fileId: string;
    }) => {
      const response = await apiFetch(`user/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ avatarUrl, fileId }),
      });

      if (!response.ok) {
        throw new Error("Unable to update user profile");
      }

      if (existingFileId) {
        const authHeader = Buffer.from(
          `${process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY}:`
        ).toString("base64");

        await fetch(`https://api.imagekit.io/v1/files/${existingFileId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Basic ${authHeader}`,
          },
        });
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-data", userId],
      });
    },
  });

  useEffect(() => {
    if (data?.url && data.fileId && status === "success") {
      mutate({
        avatarUrl: data.url,
        fileId: data.fileId,
      });
    }
  }, [data?.url, data?.fileId, mutate, status]);

  return (
    <>
      {fullScreenPreview && (
        <div
          onClick={() => setFullScreenPreview(false)}
          className="fixed inset-0 z-99 flex h-screen w-full items-center justify-center bg-black/70 backdrop-blur-sm"
        >
          <Avatar className="z-1! size-68 shadow-md">
            <AvatarImage
              src={avatarUrl ?? "/user.png"}
              alt="Profile Image"
              className="bg-background"
            />
          </Avatar>
        </div>
      )}
      <div className="flex items-center gap-5">
        <Avatar className="relative size-20 border-3 border-background outline-3 outline-transparent md:size-24">
          {uploading && (
            <div
              className="absolute top-1/2 left-1/2 -z-1 size-22 -translate-1/2 rotate-135 rounded-full transition-all duration-150 md:size-26"
              style={{
                background: `conic-gradient(var(--primary) ${(progress / 100) * 360}deg, transparent ${(progress / 100) * 360}deg)`,
              }}
            />
          )}
          <AvatarImage
            src={avatarUrl ?? "/user.png"}
            alt="Profile Image"
            onClick={() => setFullScreenPreview(true)}
            className="z-1 bg-background"
          />
          <AvatarFallback>
            <AvatarSkeleton />
          </AvatarFallback>
          <label htmlFor="user-profile-input">
            <AvatarBadge className="z-2 size-6.5! cursor-pointer transition-all duration-150 active:scale-90">
              <Plus className="size-4!" />
            </AvatarBadge>
            <input
              type="file"
              disabled={uploading}
              name="user-profile-input"
              id="user-profile-input"
              className="hidden"
              ref={fileInputRef}
              hidden
              aria-hidden
              accept="image/*"
              onChange={handleUpload}
            />
          </label>
        </Avatar>
        <div className="flex flex-col items-start">
          <h2 className="-mb-1 text-2xl font-semibold tracking-tight">
            {`${firstName} ${lastName ?? ""}`}
          </h2>
          <div className="font-[14px] tracking-tight">{email}</div>
        </div>
      </div>
    </>
  );
}
