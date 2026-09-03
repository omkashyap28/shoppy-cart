import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { serverFetch } from "@/lib/serverFetch";
import { SellerResponse } from "@/types/seller";
import {
  BadgeCheck,
  Package,
  Star,
  Store,
} from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading2, PageComponent } from "@/components/layout";
import { Badge } from "@/components/ui/badge";

interface Props {
  params: Promise<{
    sellerId: string;
  }>;
}

async function getSellerData(sellerId: string) {
  "use cache";

  return await serverFetch<SellerResponse>(`/seller/${sellerId}`, {
    next: {
      tags: [`seller:${sellerId}`],
    },
    errorMessage: "Failed to get seller. Try Again!",
  });
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { sellerId } = await params;

  try {
    const seller = await getSellerData(sellerId);

    const siteTitle = `${seller.shopName} | ${seller.category}`;

    return {
      title: siteTitle,
      description: seller.description,

      openGraph: {
        title: siteTitle,
        description: seller.description,
        type: "website",
      },

      twitter: {
        card: "summary_large_image",
        title: siteTitle,
        description: seller.description,
      },
    };
  } catch {
    return {
      title: "Seller Details",
    };
  }
}

export default async function SellerPage({ params }: Props) {
  const { sellerId } = await params;

  let seller: SellerResponse;

  try {
    seller = await getSellerData(sellerId);
  } catch {
    notFound();
  }

  const {
    shopName,
    description,
    averageRating,
    ratingCount,
    category,
    products,
    isVerified,
    createdAt,
  } = seller;

  return (
    <PageComponent heading={shopName} className="max-w-full!">
      <main className="container mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Card className="overflow-hidden">
          <CardHeader className="relative">
            <div className="flex items-start gap-4">
              <div className="flex size-14 bg-primary/5 backdrop-blur-sm shrink-0 items-center justify-center rounded-xl border">
                <Store className="size-8 text-primary" />
              </div>

              <div className="min-w-0 flex-1">
                <CardTitle className="flex flex-wrap items-center gap-2 text-xl sm:text-2xl">
                  {shopName}

                  {isVerified && (
                    <BadgeCheck
                      className="size-6 fill-primary text-background drop-shadow"
                      aria-label="Verified seller"
                    />
                  )}
                </CardTitle>
                <CardDescription>
                  {description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="relative pt-0">
            <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-x-4 gap-y-2 flex-wrap">
                <Badge className="shadow">
                  {category}
                </Badge>

                <span className="flex items-center gap-1">
                  <Star className="size-4 fill-amber-400 text-amber-400" />

                  <span className="font-medium text-foreground">
                    {averageRating.toFixed(1)}
                  </span>

                  <span>
                    ({ratingCount.toLocaleString()}{" "}
                    {ratingCount === 1 ? "rating" : "ratings"})
                  </span>
                </span>

                <span className="flex items-center gap-1">
                  <Package className="size-4" />

                  {products.length}{" "}
                  {products.length === 1 ? "product" : "products"}
                </span>
              </div>
              <span suppressHydrationWarning>Join at: {format(new Date(createdAt as string), "PPP")}</span>
            </div>
          </CardContent>
        </Card>

        <section className="mt-8">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <Heading2 >
                Explore products from {shopName}
              </Heading2>
            </div>

            <span className="text-sm text-muted-foreground">
              {products.length} {products.length === 1 ? "item" : "items"}
            </span>
          </div>

          <section className="grid grid-cols-2 gap-4 py-4 max-xs:p-4 sm:grid-cols-3 md:gap-6 md:p-6 lg:grid-cols-4">
            {products.map((product) => <ProductCard product={product} key={product.productId} />)}
          </section>

        </section>
      </main >
    </PageComponent>
  );
}