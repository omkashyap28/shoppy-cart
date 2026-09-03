export type OrderStatus =
  | "CREATED"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURN_REQUEST"
  | "EXCHANGE_REQUEST";

export interface OrderResponse {
  orderId: string;
  quantity: number;
  amount: number;
  coins: number;
  productUrl: string;
  productId: string;
  selectedAttributes?: Record<string, string>;
  orderStatus: OrderStatus;
  createdAt: string;
  confirmedAt?: string | null;
  processedAt?: string | null;
  shippedAt?: string | null;
  outOfDeliveryAt?: string | null;
  deliveredAt?: string | null;
  cancelledAt?: string | null;
  returnedAt?: string | null;
  exchangedAt?: string | null;
}
