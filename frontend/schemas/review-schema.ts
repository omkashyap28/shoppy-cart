import z from "zod";

export const reviewSchema = z.object({
  reviewImages: z
    .array(
      z.object({
        imageId: z.string(),
        thumbnailUrl: z.string(),
        imageUrl: z.string(),
      })
    )
    .optional(),
  rating: z
    .int("Rating is required")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  message: z
    .string()
    .min(2, "Message must contains minimum 2 characters")
    .max(200, "Message must not exceed 200 characters"),
});
