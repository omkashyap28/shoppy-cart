"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Coins, Heart, Star, StarHalf } from "lucide-react";
import Image from "next/image";
import { Heading2 } from "@/components/layout";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Toggle } from "@/components/ui/toggle";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/utils";
import { useAppStore } from "@/store/store";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProductResponseDto {
  productId: string;
  description: string;
  productImages: string[];
  productAttributes: Record<string, string>;
  sellerId: string;
  inStock: boolean;
  totalReviews: number;
  averageRating: number;
  categoryId: number;
  price: number;
  coins: number;
  productUrl: string;
  tags: string[];
}

export function RecentViewed() {
  const userId = useAppStore((state) => state.userId);
  const router = useRouter();

  const { data: recentViewedProducts } = useQuery<ProductResponseDto[]>({
    queryKey: ["recent-viewed", userId],
    queryFn: async () => {
      const response = await apiFetch(`recent-viewed?userId=${userId}`);
      if (!response.ok) {
        return [];
      }
      return await response.json();
    },
    enabled: !!userId,
  });

  function mapAverageReviews(rating: number) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.3 && rating % 1 <= 0.7;
    const extraFull = rating % 1 > 0.7 ? 1 : 0;

    const stars = [];
    for (let i = 0; i < fullStars + extraFull; i++) {
      stars.push(
        <Star className="size-4 fill-amber-500 text-amber-500" key={`f-${i}`} />
      );
    }
    if (hasHalf) {
      stars.push(
        <StarHalf className="size-4 fill-amber-500 text-amber-500" key="half" />
      );
    }
    return stars;
  }

  if (!recentViewedProducts || recentViewedProducts.length === 0) return null;

  return (
    <section className="mt-10 mb-4 px-0 sm:px-6 md:px-8">
      <Heading2>Recently Viewed</Heading2>
      <Carousel
        className="h-auto"
        opts={{
          align: "start",
        }}
      >
        <CarouselContent className="ml-0! cursor-grab active:cursor-grabbing">
          {recentViewedProducts.map((product) => {
            const mainImg = product.productImages?.[0] || "/placeholder.jpg";

            return (
              <CarouselItem
                key={product.productId}
                className="basis-1/1 px-2 py-2 sm:basis-1/2 lg:basis-1/4"
              >
                <Card className="flex h-full flex-col items-center justify-between border-border/80 transition-all hover:border-primary/40">
                  <CardContent className="w-full">
                    <Link href={`/products/${product.productId}`}>
                      <div className="relative h-60 w-full overflow-hidden rounded-md bg-muted">
                        <Image
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          src={mainImg}
                          alt={product.description}
                          className="object-cover"
                        />
                      </div>
                    </Link>
                    <div className="mt-4 block">
                      <h3 className="line-clamp-2 text-base font-semibold tracking-tight">
                        {product.description}
                      </h3>
                      <div className="mt-2">
                        <p className="text-lg font-bold text-foreground">
                          ₹ {product.price}
                        </p>
                        <p className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Coins className="size-3.5 text-amber-500" />{" "}
                          {product.coins} Coins
                        </p>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            {mapAverageReviews(product.averageRating || 0)}
                            <span className="ml-1 text-xs text-muted-foreground">
                              ({product.totalReviews || 0})
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="min-w-full justify-between gap-2 border-t border-border/60 bg-background px-4 py-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        router.push(`/products/${product.productId}`)
                      }
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        router.push(`/products/${product.productId}/order`)
                      }
                    >
                      Buy Now
                    </Button>
                  </CardFooter>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselNext className="mr-10 md:mr-4" />
        <CarouselPrevious className="ml-10 md:ml-4" />
      </Carousel>
    </section>
  );
}
