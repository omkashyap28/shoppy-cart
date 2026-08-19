"use client";

import { AnimatePresence, motion } from "motion/react";
import { Heart, ShoppingCart } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePings } from "react-pings";

import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { apiFetch, cn } from "@/lib/utils";
import { useAppStore } from "@/store/store";
import { useState } from "react";

interface CartButtonProps {
  productId: string;
}

interface CartCheckResponse {
  exists: boolean;
  productId: string;
  cartId?: string;
}

const cartCheckKey = (userId: string, productId: string) =>
  ["cart-check", userId, productId] as const;

export function CartButton({ productId }: CartButtonProps) {
  const [exists, setExists] = useState(false);

  const userId = useAppStore((state) => state.userId);
  const queryClient = useQueryClient();
  const pings = usePings();

  const queryKey = cartCheckKey(userId, productId);

  const { data, isPending: isChecking } = useQuery<CartCheckResponse>({
    queryKey,
    enabled: Boolean(userId && productId),
    staleTime: 30_000,
    queryFn: async () => {
      const response = await apiFetch(
        `user/${userId}/cart/check-product`,
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
        throw new Error("Failed to check cart");
      }

      const data = (await response.json()) as CartCheckResponse;

      setExists(data.exists);
      return data;
    },
  });

  const cartItemId = data?.cartId;

  const addToCartMutation = useMutation({
    mutationFn: async () => {

      const payload = {
        productId,
        productAttributes: {},
        quantity: 1,
      }

      const response = await apiFetch(`user/${userId}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to add product to cart");
      }
      
      return response.json();
    },

    onError: () => {
      pings.error("Failed to add product to cart");
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey,
      });
    },
  });

  const deleteFromCartMutation = useMutation({
    mutationFn: async (cartId: string) => {
      const response = await apiFetch(
        `user/${userId}/cart/${cartId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove product from cart");
      }
    },

    onError: () => {
      pings.error("Failed to remove product from cart");
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey,
      });
    },
  });

  const isMutating =
    addToCartMutation.isPending || deleteFromCartMutation.isPending;

  const loading = isChecking || isMutating;

  const handleWishlist = () => {
    if (!userId || isMutating) return;

    addToCartMutation.mutate();
  };

  const handleDelete = () => {
    if (!userId || !cartItemId || isMutating) return;

    deleteFromCartMutation.mutate(cartItemId);
  };

  return (
    <Button
      onClick={exists ? handleDelete : handleWishlist}
      variant="outline"
      disabled={!userId || loading}
      className="w-full overflow-hidden transition-all duration-200"
    >
      {loading ? (
        <Spinner className="size-4" />
      ) : (
        <motion.div
          initial={false}
          animate={{
            scale: exists ? [1, 1.25, 1] : 1,
          }}
          transition={{
            duration: 0.25,
            ease: "easeOut",
          }}
        >
          <ShoppingCart className="size-4" />
        </motion.div>
      )}

      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={exists ? "added" : "add"}
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
          {exists ? "Added to Cart" : "Add to Cart"}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
}
