export interface CartResponse {
  cartItemId: string;
  productId: string;
  brandName: string;
  description: string;
  productThumbnail: string;
  inStock: boolean;
  totalReviews: number;
  averageRating: number;
  price: number;
  coins: number;
  productUrl: string;
  quantity: number;
}