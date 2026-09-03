"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppStore } from "@/store/store";
import { apiFetch } from "@/lib/utils";
import { usePings } from "react-pings";
import { Spinner } from "../ui/spinner";

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 10;

interface CartItemQuantitySelectorProps {
  cartId: string;
  initialQuantity: number;
}

interface UpdateQuantityParams {
  cartId: string;
  quantity: number;
}

export function CartItemQuantitySelector({
  cartId,
  initialQuantity,
}: CartItemQuantitySelectorProps) {
  const [quantity, setQuantity] = useState(initialQuantity);

  const previousQuantity = useRef(initialQuantity);

  const pings = usePings();
  const queryClient = useQueryClient();
  const userId = useAppStore((state) => state.userId);

  useEffect(() => {
    (() => setQuantity(initialQuantity))();
    previousQuantity.current = initialQuantity;
  }, [initialQuantity]);

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ cartId, quantity }: UpdateQuantityParams) => {
      const response = await apiFetch(`user/${userId}/cart/${cartId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update cart quantity");
      }

      return response.json();
    },

    onMutate: async () => {
      previousQuantity.current = previousQuantity.current;

      await queryClient.cancelQueries({
        queryKey: ["cart", userId],
      });

      return {
        previousQuantity: previousQuantity.current,
      };
    },

    onSuccess: (_, variables) => {
      previousQuantity.current = variables.quantity;

      queryClient.invalidateQueries({
        queryKey: ["cart", userId],
      });
    },

    onError: (_error, _variables, context) => {
      if (context?.previousQuantity !== undefined) {
        setQuantity(context.previousQuantity);
        previousQuantity.current = context.previousQuantity;
      }

      pings.error("Failed to update cart quantity");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (cartId: string) => {
      const response = await apiFetch(`user/${userId}/cart/${cartId}`, {
        method: "DELETE",
      });

      if (response.status !== 204) {
        throw new Error("Failed to delete cart item");
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart", userId],
      });
    },

    onError: () => {
      pings.error("Failed to delete cart item");
    },
  });

  const isUpdating = updateQuantityMutation.isPending;
  const isDeleting = deleteMutation.isPending;

  const isBusy = isUpdating || isDeleting;

  const updateQuantity = (nextQuantity: number) => {
    if (nextQuantity < MIN_QUANTITY || nextQuantity > MAX_QUANTITY || isBusy) {
      return;
    }

    setQuantity(nextQuantity);

    updateQuantityMutation.mutate({
      cartId,
      quantity: nextQuantity,
    });
  };

  const handleIncrement = () => {
    updateQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    updateQuantity(quantity - 1);
  };

  const handleDelete = () => {
    if (isBusy) return;

    const confirmed = window.confirm(
      "Do you want to remove this item from your cart?"
    );

    if (!confirmed) return;

    deleteMutation.mutate(cartId);
  };

  return (
    <div className="flex items-center rounded-lg border border-border/40 select-none">
      <AnimatePresence mode="wait" initial={false}>
        {quantity > MIN_QUANTITY ? (
          <motion.div
            key="minus"
            initial={{
              opacity: 0,
              scale: 0.7,
              y: 4,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.7,
              y: -4,
            }}
            transition={{
              duration: 0.15,
              ease: "easeOut",
            }}
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={isBusy}
              onClick={handleDecrement}
              aria-label="Decrease quantity"
            >
              <Minus />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="trash"
            initial={{
              opacity: 0,
              scale: 0.7,
              y: 4,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.7,
              y: -4,
            }}
            transition={{
              duration: 0.15,
              ease: "easeOut",
            }}
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={isDeleting}
              onClick={handleDelete}
              aria-label="Remove item from cart"
              className="text-destructive hover:text-destructive"
            >
              {isDeleting ? <Spinner /> : <Trash2 />}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="relative flex size-7 shrink-0 items-center justify-center overflow-hidden font-medium"
        aria-live="polite"
        aria-label={`Quantity ${quantity}`}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            layout
            key={quantity}
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -10,
            }}
            transition={{
              duration: 0.15,
              ease: "easeOut",
            }}
            className="absolute"
          >
            {quantity}
          </motion.span>
        </AnimatePresence>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={quantity >= MAX_QUANTITY || isBusy}
        onClick={handleIncrement}
        aria-label="Increase quantity"
      >
        <Plus />
      </Button>
    </div>
  );
}
