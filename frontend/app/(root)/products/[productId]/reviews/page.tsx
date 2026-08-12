import { Loader, PageComponent } from "@/components/layout";
import Review from "@/components/products/review/review";
import { Suspense } from "react";

interface Props {
  params: Promise<{ productId: string }>;
}

export default async function Page({ params }: Props) {
  const { productId } = await params;

  return (
    <PageComponent className="max-w-full!" heading="Reviews">
      <Review productId={productId} />
    </PageComponent>
  );
}
