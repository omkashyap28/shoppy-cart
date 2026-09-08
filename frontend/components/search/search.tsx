"use client";

import { useSearchParams } from "next/navigation";
import { InfiniteScroll } from "../layout";
import { usePaginationQuery } from "@/hooks/usePaginationQuery";
import { Products } from "@/types/product";
import { ProductCard } from "../products/product-card";
import { PackageSearch } from "lucide-react";
import { useAppStore } from "@/store/store";
import { useQueryClient } from "@tanstack/react-query";

export function Search() {
  const searchParams = useSearchParams();
  const userId = useAppStore((state) => state.userId);

  const queryClient = useQueryClient();

  const query = searchParams.toString();

  const {
    response,
    status,
    isFetchNextPageError,
    isFetchingNextPage,
    refetch,
    hasNextPage,
    fetchNextPage,
  } = usePaginationQuery<Products>({
    queryKey: ["search-results", query],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams(query);

      if (pageParam) params.set("cursor", String(pageParam));
      if (userId) params.set("userId", userId);

      const response = await fetch(`/backend/search?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }

      queryClient.invalidateQueries({ queryKey: ["user-searches", userId] });
      return response.json();
    },
  });

  return (
    <InfiniteScroll
      isError={status === "error"}
      hasMore={hasNextPage}
      loading={status === "pending"}
      onLoadMore={fetchNextPage}
      onRetry={refetch}
      isFetchNextPageError={isFetchNextPageError}
      isFetchingNextPage={isFetchingNextPage}
    >
      {!response || response.length === 0 ? (
        <div className="relative flex h-100! w-full flex-col items-center justify-center bg-background p-2">
          <PackageSearch className="mb-4 size-32 text-muted-foreground" />
          <p className="text-sm tracking-tight text-muted-foreground">
            No results found
          </p>
        </div>
      ) : (
        <div className="@container w-full">
          <section className="grid grid-cols-1 gap-4 p-4 sm:gap-6 @sm:grid-cols-2 @md:grid-cols-3 @3xl:grid-cols-4 @3xl:px-6 @5xl:grid-cols-5">
            {response?.map((product) => (
              <ProductCard product={product} key={product.productId} />
            ))}
          </section>
        </div>
      )}
    </InfiniteScroll>
  );
}
