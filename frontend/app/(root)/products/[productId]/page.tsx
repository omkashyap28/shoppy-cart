import { Metadata } from "next";
import { Product } from "@/components/products";
import { Product as ProductType } from "@/types/product";
import dynamic from "next/dynamic";
import { Loader } from "@/components/layout";
import { Discussion } from "@/components/products/discussion/discussion";
import { serverFetch } from "@/lib/serverFetch";
import { cacheLife } from 'next/cache'

const Review = dynamic(() => import("@/components/products/review/review"), {
  loading: () => <Loader />,
});

interface Props {
  params: Promise<{ productId: string }>;
}

const getProduct = async (productId: string) => {
  "use cache";
  cacheLife({stale: 300});
  
  return await serverFetch<ProductType>(`/product/${productId}`, {
    next: {
      tags: [`product:${productId}`],
    }
  });

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return { title: "Product Details" };
  }
}

export default async function ProductPage({ params }: Props) {
  const { productId } = await params;
  const product = await getProduct(productId);

  return (
    <>
      <Product product={product} />
      <Review productId={productId} />
      <Discussion productId={productId} />
    </>
  );
}
