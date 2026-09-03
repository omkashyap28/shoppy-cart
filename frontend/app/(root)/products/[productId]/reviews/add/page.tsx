import { Loader, PageComponent } from "@/components/layout";
import { AddReviewForm } from "@/forms";
import { serverFetch } from "@/lib/serverFetch";
import { Product as ProductType } from "@/types/product";
import { Image } from "@imagekit/next";
import Link from "next/link";
import { Suspense } from "react";

interface Props {
  params: Promise<{ productId: string }>;
}

const getProduct = async (productId: string) => {
  return await serverFetch<ProductType>(`/product/${productId}`);
};

async function AddReviewContent({ params }: Props) {
  const { productId } = await params;
  const product = await getProduct(productId);

  return (
    <>
      <Link href={`/products/${productId}`}>
        <div className="flex w-full items-start gap-2 border-b border-dashed border-border pb-5 sm:gap-4">
          <div className="relative aspect-square size-24 shrink-0 overflow-hidden rounded-md">
            <Image
              src={product.productThumbnail}
              alt={product.description}
              fill
              className="aspect-square bg-background object-fill object-center"
              sizes="100%"
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {product.brandName || "Store"}
              </p>
              {product.averageRating}/5
            </div>
            <h3 className="line-clamp-3 text-lg leading-tight font-semibold">
              {product.description}
            </h3>
          </div>
        </div>
      </Link>
      <AddReviewForm className="w-full" />
    </>
  );
}

export default function AddReview({ params }: Props) {
  return (
    <PageComponent heading="Review this product">
      <Suspense fallback={<Loader />}>
        <AddReviewContent params={params} />
      </Suspense>
    </PageComponent>
  );
}
