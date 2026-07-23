"use cache";

import { Metadata } from "next";
import {
  ProductHeader,
  ProductImageGallery,
  ProductPurchaseCard,
  ProductTags,
} from "@/components/products";
import { Product } from "@/types/product";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Star } from "lucide-react";

interface Props {
  params: Promise<{ productId: string }>;
}

const getProduct = async (productId: string): Promise<Product> => {
  const baseUrl = process.env.NEXT_BACKEND_BASE_URL;
  const response = await fetch(`${baseUrl}/product/${productId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch product data");
  }

  return response.json() as Promise<Product>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productId } = await params;

  try {
    const product = await getProduct(productId);
    const mainImageUrl =
      product.productImages?.[0]?.imageUrl || product.productThumbnail;
    const siteTitle = `${product.description} | ${product.brandName || "Store"}`;

    return {
      title: siteTitle,
      description: `Buy ${product.description} for only $${product.price}.`,
      openGraph: {
        title: siteTitle,
        description: `Get your hands on the ${product.description}. Available now.`,
        type: "website",
        images: [
          {
            url: mainImageUrl,
            width: 1200,
            height: 630,
            alt: product.description,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: siteTitle,
        description: `Check out ${product.description} - Only $${product.price}!`,
        images: [
          {
            url: mainImageUrl,
            width: 1200,
            height: 630,
            alt: product.description,
          },
        ],
      },
    };
  } catch (error) {
    return { title: "Product Details" };
  }
}

const Fallback = () => (
  <div className="flex h-56 w-full items-center justify-center">
    <Spinner className="size-8" />
  </div>
);

export default async function ProductPage({ params }: Props) {
  const { productId } = await params;
  const product = await getProduct(productId);

  const {
    averageRating,
    brandName,
    coins,
    description,
    inStock,
    price,
    productImages,
    productThumbnail,
    tags,
    totalReviews,
    sellerId,
  } = product;

  return (
    <Suspense fallback={<Fallback />}>
      <div className="grid gap-5 py-6 sm:grid-cols-[1fr_280px] md:py-8">
        <div className="xl:sticky xl:top-20">
          <div className="mb-6 xl:hidden">
            <div className="block space-y-3">
              <ProductTags
                tags={tags}
                variant="secondary"
                className="flex flex-wrap gap-2"
              />

              <Separator />

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span>{brandName}</span>
                  <span>•</span>
                  <Link
                    href={`/seller/${sellerId}`}
                    className="font-medium underline-offset-4 hover:underline"
                  >
                    View Seller
                  </Link>
                </div>

                <h1 className="text-xl leading-tight font-semibold tracking-tight lg:text-2xl">
                  {description}
                </h1>

                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="size-4 fill-current" />
                    <span className="font-semibold text-foreground">
                      {averageRating ?? "0.0"}
                    </span>
                  </div>

                  <span className="text-muted-foreground">
                    ({totalReviews} Reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="grid w-full gap-3 xl:grid-cols-[60%_1fr]">
            <ProductImageGallery
              productImages={productImages}
              productThumbnail={productThumbnail}
              description={description}
            />

            <div className="w-full space-y-6 md:px-6">
              <ProductHeader
                productId={productId}
                brandName={brandName}
                description={description}
                tags={tags}
                averageRating={averageRating}
                totalReviews={totalReviews}
                sellerId={sellerId}
                inStock={inStock}
                price={price}
                coins={coins}
              />
            </div>
          </div>
        </div>

        <div className="w-full">
          <ProductPurchaseCard
            price={price}
            coins={coins}
            inStock={inStock}
            productId={productId}
            productThumbnail={productThumbnail}
            description={description}
          />
        </div>
      </div>
    </Suspense>
  );
}
