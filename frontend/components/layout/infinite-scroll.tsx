"use client";

import { ReactNode, useCallback, useEffect, useRef } from "react";
import { Loader } from "./loader";
import { Button } from "../ui/button";

interface InfiniteScrollProps {
  children: ReactNode;
  hasMore: boolean;
  loading: boolean;
  isError: boolean;
  onLoadMore: () => void;
  onRetry: () => void;
  className?: string;
  loader?: ReactNode;
  errorComponent?: ReactNode;
  endComponent?: ReactNode;
  rootMargin?: string;
  isFetchNextPageError: boolean;
  isFetchingNextPage: boolean;
  showLastComponent?: boolean;
}

export function InfiniteScroll({
  children,
  endComponent,
  isError,
  errorComponent,
  hasMore,
  loader,
  loading,
  onLoadMore,
  onRetry,
  className,
  rootMargin = "300px",
  isFetchNextPageError,
  isFetchingNextPage,
  showLastComponent = false,
}: InfiniteScrollProps) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];

      if (!entry.isIntersecting) {
        return;
      }

      if (!hasMore || loading || isError) {
        return;
      }

      onLoadMore();
    },
    [isError, hasMore, loading, onLoadMore]
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin,
      threshold: 0,
    });

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [handleIntersection, rootMargin]);

  if (loading) return <Loader />;

  return (
    <div className={className}>
      {children}

      <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />

      {isFetchingNextPage && (
        <div className="flex w-full justify-center py-4">
          {loader ?? <Loader />}
        </div>
      )}

      {isFetchNextPageError && !loading && (
        <div className="flex w-full flex-col items-center justify-center gap-2 py-4">
          {errorComponent ?? (
            <>
              <p className="text-sm text-destructive">Failed to load more.</p>

              {onRetry && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onRetry}
                  className="text-sm font-medium underline underline-offset-4"
                >
                  Retry
                </Button>
              )}
            </>
          )}
        </div>
      )}

      {showLastComponent && !hasMore && !loading && !isError && (
        <div className="flex w-full justify-center py-4">
          {endComponent ?? (
            <p className="text-sm text-muted-foreground">
              You&#39;ve reached the end.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
