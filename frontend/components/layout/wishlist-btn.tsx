"use client";

import { AnimatePresence, motion } from "motion/react";
import { Heart } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePings } from "react-pings";

import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { apiFetch, cn } from "@/lib/utils";
import { useAppStore } from "@/store/store";
import { useState } from "react";

interface WishlistButtonProps {
  productId: string;
}

interface WishlistCheckResponse {
  exists: boolean;
  productId: string;
  wishlistId?: string;
}

const wishlistCheckKey = (userId: string, productId: string) =>
  ["wishlist-check", userId, productId] as const;

export function WishlistButton({ productId }: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const userId = useAppStore((state) => state.userId);
  const queryClient = useQueryClient();
  const pings = usePings();

  const queryKey = wishlistCheckKey(userId, productId);

  const { data, isPending: isChecking } = useQuery<
    WishlistCheckResponse | undefined
  >({
    queryKey,
    enabled: Boolean(userId && productId),
    staleTime: 30_000,
    queryFn: async () => {
      const response = await apiFetch(
        `user/${userId}/wishlists/check-product`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to check wishlist");
      }

      const data = (await response.json()) as WishlistCheckResponse;

      setIsWishlisted(data.exists);
      return data;
    },
  });

  const wishlistItemId = data?.wishlistId;

  const addWishlistMutation = useMutation({
    mutationFn: async () => {
      const response = await apiFetch(`user/${userId}/wishlists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add product to wishlist");
      }

      return response.json();
    },

    onError: () => {
      pings.error("Failed to add product to wishlist");
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey,
      });
    },
  });

  const deleteWishlistMutation = useMutation({
    mutationFn: async (wishlistItemId: string) => {
      const response = await apiFetch(
        `user/${userId}/wishlists/${wishlistItemId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove product from wishlist");
      }
    },

    onError: () => {
      pings.error("Failed to remove product from wishlist");
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey,
      });
    },
  });

  const isMutating =
    addWishlistMutation.isPending || deleteWishlistMutation.isPending;

  const loading = isChecking || isMutating;

  const handleWishlist = () => {
    if (!userId || isMutating) return;

    addWishlistMutation.mutate();
  };

  const handleDelete = () => {
    if (!userId || !wishlistItemId || isMutating) return;

    deleteWishlistMutation.mutate(wishlistItemId);
  };

  return (
    <Button
      onClick={isWishlisted ? handleDelete : handleWishlist}
      variant="destructive"
      disabled={loading || !userId}
      className="w-fit overflow-hidden transition-all duration-200"
    >
      {loading ? (
        <Spinner className="size-4" />
      ) : (
        <motion.div
          initial={false}
          animate={{
            scale: isWishlisted ? [1, 1.25, 1] : 1,
          }}
          transition={{
            duration: 0.25,
            ease: "easeOut",
          }}
        >
          <Heart
            className={cn(
              "size-4 transition-all duration-200",
              isWishlisted && "fill-current"
            )}
          />
        </motion.div>
      )}

      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isWishlisted ? "added" : "add"}
          initial={{
            opacity: 0,
            y: 5,
            filter: "blur(6px)",
          }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          exit={{
            opacity: 0,
            y: -5,
            filter: "blur(6px)",
          }}
          transition={{
            duration: 0.15,
            ease: "easeOut",
          }}
        >
          {isWishlisted ? "Added to Wishlist" : "Add to Wishlist"}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
}
