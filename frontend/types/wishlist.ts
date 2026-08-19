export interface WishlistResponse {
  wishlistId:string;
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
  productAttributes: Map<string, string> ;
}