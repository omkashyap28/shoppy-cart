"use client";

import { Heading2, Loader } from "@/components/layout";
import { DiscussionList } from "./discussion-list";
import { DiscussionTextarea } from "./discussion-textarea";
import { useQuery } from "@tanstack/react-query";
import { DiscussionType } from "@/types/product";

interface DiscussionProps {
  productId: string;
}

export default function Discussion({ productId }: DiscussionProps) {
  const {
    data: discussions,
    isLoading,
    isError,
  } = useQuery<DiscussionType[]>({
    queryKey: ["discussions", productId],
    queryFn: async () => {
      const response = await fetch(
        `/backend/product/${productId}/discussions`,
        {
          cache: "no-store",
        }
      );
      const data = response.json();
      return data;
    },
    staleTime: 10 * 60 * 1000,
    enabled: !!productId,
  });

  return (
    <section id="discussions" className="w-full py-6">
      <Heading2 className="relative border-y border-border bg-background py-2 text-xl md:text-3xl">
        Product Discussion
      </Heading2>
      <div className="grid w-full gap-4 py-4 lg:grid-cols-[1fr_380px] lg:px-4 lg:py-6">
        <div className="w-full border-dashed border-border max-md:order-last max-sm:border-t md:border-r">
          {isLoading ? (
            <Loader />
          ) : isError || !discussions ? (
            <div className="relative z-10 flex h-36 w-full items-center justify-center rounded-full bg-background/30 p-2">
              <p className="text-muted-foreground">
                Failed to fetch product discussion&#39;s.
              </p>
            </div>
          ) : (
            <DiscussionList discussions={discussions} />
          )}
        </div>
        <DiscussionTextarea productId={productId} />
      </div>
    </section>
  );
}
