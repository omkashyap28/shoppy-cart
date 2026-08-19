"use client";

import { useAppStore } from "@/store/store";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/layout";
import { apiFetch, cn } from "@/lib/utils";
import { LayoutGrid, RotateCcw, Rows2, Compass } from "lucide-react";
import { WishlistCard } from "./wishlist-card";
import { WishlistResponse } from "@/types/wishlist";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function Wishlist() {
  const [layout, setLayout] = useState<"column" | "row">("column");

  const userId = useAppStore((state) => state.userId);
  const router = useRouter();

  const {
    data: wishlist,
    status,
    refetch,
  } = useQuery<WishlistResponse[]>({
    queryKey: ["wishlist", userId],
    queryFn: async () => {
      const response = await apiFetch(`user/${userId}/wishlists`);

      if (!response.ok) {
        throw new Error("Failed to fetch wishlist");
      }

      return await response.json();
    },
    enabled: !!userId,
    refetchOnWindowFocus: true,
    refetchOnMount: true
  });

  if (status === "pending") return <Loader />;

  if (status === "error") {
    return (
      <div className="relative z-10 flex h-66 w-full flex-col items-center justify-center rounded-full bg-background/30 p-2">
        <p className="tracking tight mb-4 text-base text-destructive">
          Failed to load wishlist. Try again!
        </p>
        <Button variant="outline" onClick={() => refetch()}>
          <RotateCcw /> Retry
        </Button>
      </div>
    );
  }

  if (wishlist.length < 1) {
    return (
      <div className="relative z-10 flex h-66 w-full flex-col items-center justify-center rounded-full bg-background/30 p-2">
        <p className="tracking tight mb-4 text-base text-muted-foreground">
          Wishlist is empty
        </p>
        <Button onClick={() => router.push("/products")}>
          <Compass /> Explore Products
        </Button>
      </div>
    );
  }

  return (
    <div className="@container w-full">
      <div className="mb-4 flex items-center justify-end @max-xs:hidden">
        <div className="flex items-center rounded-lg border border-border/70">
          <Button
            variant={layout === "row" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setLayout("row")}
          >
            <Rows2 />
          </Button>
          <Button
            variant={layout === "column" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setLayout("column")}
          >
            <LayoutGrid />
          </Button>
        </div>
      </div>
      <div
        className={cn(
          "grid w-full gap-2",
          layout === "column"
            ? "grid-cols-2 @max-xs:grid-cols-1"
            : "grid-cols-1"
        )}
      >
        {wishlist.map((wishlistItem) => (
          <WishlistCard
            wishlistItem={wishlistItem}
            key={wishlistItem.wishlistId}
            layout={layout}
          />
        ))}
      </div>
    </div>
  );
}
