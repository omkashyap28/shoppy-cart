export interface UploadedItems {
  imageId: string;
  thumbnailUrl: string;
  imageUrl: string;
  isThumbnail: boolean;
  priority: number;
  altText: string;
}

export interface ProductImage {
  altText: string | null;
  imageId: string;
  imageUrl: string;
  priority: number;
  thumbnailUrl: string;
}

export interface ProductCardProps {
  productId: string;
  brandName: string;
  description: string;
  productThumbnail: string;
  sellerId: string;
  inStock: boolean;
  totalReviews: number;
  averageRating: number;
  categoryId: number;
  price: number;
  coins: number;
  productUrl: string;
  tags: string[];
}

export interface Product {
  averageRating: string;
  brandName: string;
  categoryId: number;
  coins: number;
  description: string;
  inStock: boolean;
  price: number;
  productAttributes: Map<string, string>;
  productId: string;
  productImages: ProductImage[];
  productThumbnail: string;
  productUrl: string;
  sellerId: string;
  tags: string[];
  totalReviews: number;
}
