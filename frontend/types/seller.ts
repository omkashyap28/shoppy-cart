import { Products } from "./product";

export interface SellerResponse {
  sellerId: string;
  shopName: string;
  description: string;
  averageRating: number;
  ratingCount: number;
  category: string;
  products: Products[];
  shopAddress: ShopAddressResponse;
  isVerified: boolean;
  createdAt: string;
}

export interface ShopAddressResponse {
  address: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}
