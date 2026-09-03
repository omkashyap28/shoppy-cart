export interface ReviewImageType {
  imageId: string;
  thumbnailUrl: string;
  imageUrl: string;
}

export interface ReviewType {
  reviewId: string;
  rating: number;
  message: string;
  reviewImages: ReviewImageType[];
  userId: string;
  profileImgUrl: string | null;
  username: string;
  edited: boolean;
  createdAt: unknown;
}

export interface ReviewResponseType {
  content: ReviewType[];
  nextCursor: number | null;
  hasMore: boolean;
}

export interface ReviewPayloadType {
  userId: string;
  rating: number;
  message: string;
  reviewImages: ReviewImageType[];
}

export interface ReviewStatsResponseType {
  productId: string;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<string, number>;
}
