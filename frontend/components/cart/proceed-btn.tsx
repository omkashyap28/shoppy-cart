"use client";

import { MagnetButton } from "../layout";
import { Button } from "../ui/button";
import { CartResponse } from "@/types/cart";
import { useRouter } from "next/navigation";

export function ProceedButton({ cartItems }: { cartItems?: CartResponse[] }) {
  const router = useRouter();

  const handleProceed = () => {
    if (cartItems && cartItems.length > 0) {
      const firstItem = cartItems[0];
      router.push(
        `/products/${firstItem.productId}/order?quantity=${firstItem.quantity}`
      );
    }
  };

  return (
    <div className="sticky inset-x-auto bottom-0 z-4 mt-4 border-t border-border/60 bg-background p-3 backdrop-blur-md">
      <MagnetButton magnetStrength={0.1} padding={2}>
        <Button
          onClick={handleProceed}
          size="lg"
          className="w-full hover:bg-primary"
          disabled={!cartItems || cartItems.length === 0}
        >
          Proceed to Buy ({cartItems?.length || 0} items)
        </Button>
      </MagnetButton>
    </div>
  );
}
