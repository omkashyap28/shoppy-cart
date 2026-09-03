"use client";

import { Products } from "@/types/product";
import { InfiniteScroll } from "../layout/infinite-scroll";
import { usePaginationQuery as useInfiniteScroll } from "@/hooks/usePaginationQuery";
import { ProductCard } from "./product-card";

export function ProductPage() {
  const {
    response,
    fetchNextPage,
    isFetchNextPageError,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    status,
  } = useInfiniteScroll<Products>({
    queryKey: [`products`],
    queryFn: async () => {
      const response = await fetch(`/backend/search/initial`);

      if (response.status !== 200) {
        throw new Error("Failed to get initial product");
      }

      return await response.json();
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
      <section className="grid grid-cols-2 gap-4 py-4 max-xs:p-4 sm:grid-cols-3 md:gap-6 md:p-6 lg:grid-cols-4">
        {response?.map((product) => (
          <ProductCard product={product} key={product.productId} />
        ))}
      </section>
    </InfiniteScroll>
  );
}
