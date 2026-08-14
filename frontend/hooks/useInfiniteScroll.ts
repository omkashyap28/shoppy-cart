import { InfiniteRespone } from "@/types/infiniteScroll";
import { QueryFunctionContext, useInfiniteQuery } from "@tanstack/react-query";

interface UserInfiniteQueryOptions<T> {
  queryKey: string[];
  queryFn: (context: QueryFunctionContext) => Promise<InfiniteRespone<T>>;
  initialPageParam?: number;
}

export function useInfiniteScroll<T = unknown>({
  queryKey,
  queryFn,
  initialPageParam = 0,
}: UserInfiniteQueryOptions<T>) {
  const {
    data,
    error,
    isLoading,
    isError,
    fetchNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    refetch,
    hasNextPage,
    status
  } = useInfiniteQuery({
    queryKey: queryKey,
    queryFn: queryFn,
    initialPageParam: initialPageParam,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
  });

  const response = data?.pages.flatMap((page) => page.content);

  return {
    response,
    error,
    isLoading,
    isError,
    fetchNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    refetch,
    hasNextPage,
    status,
  };
}
