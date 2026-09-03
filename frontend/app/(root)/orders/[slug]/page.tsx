import { Loader, PageComponent } from "@/components/layout";
import { OrderDetail } from "@/components/orders/order-detail";
import { Metadata } from "next";
import { Suspense, use } from "react";

interface Props {
  params: Promise<{ slug: string }>;
}

export const metadata: Metadata = {
  title: "Order Details",
  description: "View detailed tracking and information about your order.",
};

function OrderDetailContent({ params }: Props) {
  const { slug } = use(params);

  return <OrderDetail orderId={slug} />;
}

export default function OrderDetailPage({ params }: Props) {
  return (
    <PageComponent heading="Order Details">
      <Suspense fallback={<Loader />}>
        <OrderDetailContent params={params} />
      </Suspense>
    </PageComponent>
  );
}
