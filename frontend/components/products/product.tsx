import { Product as ProductType } from "@/types/product";
import { ProductHeader } from "./product-header";
import { ProductImageGallery } from "./product-image-gallery";
import { ProductPurchaseCard } from "./product-purchase-card";
import { Star } from "lucide-react";
import Link from "next/link";
import { AffiliateProductCard } from "../affiliate/affiliate-product-card";

interface ProductProps {
  product: ProductType;
}

export function Product({ product }: ProductProps) {
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
    productId,
  } = product;

  return (
    <>
      <div className="grid gap-4 py-6 sm:grid-cols-[1fr_280px] md:gap-6 md:py-8">
        <div>
          <div className="mb-6 xl:hidden">
            <div className="block space-y-3">
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
          <div className="grid w-full gap-3 xl:sticky xl:top-20 xl:grid-cols-[60%_1fr]">
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

        <div className="w-full space-y-5">
          <AffiliateProductCard
            productId={productId}
            productThumbnail={productThumbnail}
            description={description}
          />
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
    </>
  );
}
