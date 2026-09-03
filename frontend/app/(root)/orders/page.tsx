import { PageComponent } from "@/components/layout";
import { OrderList } from "@/components/orders/order-list";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Orders",
  description:
    "View and manage your recent orders, tracking status, returns and invoices.",
  keywords: ["orders", "shopping history", "track order", "purchases"],
};

export default function OrdersPage() {
  return (
    <PageComponent heading="Your Orders">
      <OrderList />
    </PageComponent>
  );
}
