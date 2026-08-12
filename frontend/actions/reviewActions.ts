"use server";

import { serverFetch } from "@/lib/serverFetch";
import { ReviewResponseType } from "@/types/review";

export async function createReview(
  productId: string,
  payload: unknown,
  options: RequestInit = {}
) {

  return serverFetch<ReviewResponseType>(`/product/${productId}/reviews`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(payload),
    validateStatus: (status) => status === 201,
    errorMessage: "Failed to create review",
    revalidate: `reviews:${productId}`,
    ...options
  });
}