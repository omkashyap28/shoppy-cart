import { Loader, PageComponent } from "@/components/layout";
import { ProductCheckout } from "@/components/products/product-checkout";
import { serverFetch } from "@/lib/serverFetch";
import { Product as ProductType } from "@/types/product";
import { Metadata } from "next";
import { Suspense, use } from "react";

interface Props {
  params: Promise<{ productId: string }>;
}

export const metadata: Metadata = {
  title: "Checkout Order",
  description: "Complete your purchase securely.",
};

const getProduct = async (productId: string) => {
  return await serverFetch<ProductType>(`/product/${productId}`);
};

async function OrderPageContent({ params }: Props) {
  const { productId } = await params;
  const product = await getProduct(productId);

  return <ProductCheckout productId={productId} product={product} />;
}

export default function OrderPage({ params }: Props) {
  return (
    <PageComponent heading="Order Checkout" className="max-w-5xl!">
      <Suspense fallback={<Loader />}>
        <OrderPageContent params={params} />
      </Suspense>
    </PageComponent>
  );
}
