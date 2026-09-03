"use client";

import { Button } from "../ui/button";
import { apiFetch } from "@/lib/utils";
import { Heart } from "lucide-react";
import { useAppStore } from "@/store/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePings } from "react-pings";
import { Spinner } from "../ui/spinner";

interface WishlistButtonProps {
  wishlistId?: string;
}

export function WishlistButton({ wishlistId = "" }: WishlistButtonProps) {
  const userId = useAppStore((state) => state.userId);

  const queryClient = useQueryClient();
  const pings = usePings();

  const { mutate: deleteWishlistMutation, isPending } = useMutation({
    mutationFn: async ({
      userId,
      wishlistId,
    }: {
      userId: string;
      wishlistId: string;
    }) => {
      const response = await apiFetch(
        `user/${userId}/wishlists/${wishlistId}`,
        {
          method: "DELETE",
        }
      );

      if (response.status !== 204) {
        throw new Error("Failed to remove product from wishlist");
      }
    },
    onError: () => {
      pings.error("Fail to remove product from wishlist");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wishlist", userId],
      });
    },
  });

  const handleDelete = () => {
    deleteWishlistMutation({
      userId,
      wishlistId,
    });
  };

  return (
    <Button
      onClick={handleDelete}
      variant="destructive"
      size="icon-lg"
      disabled={isPending}
      className="rounded-full! border-none shadow"
    >
      {isPending ? (
        <Spinner />
      ) : (
        <Heart className="size-4 fill-current text-destructive transition-colors duration-200 hover:text-destructive" />
      )}
    </Button>
  );
}
