import z, { number } from "zod";

export const addProductSchema = z.object({
  brandName: z
    .string("Brand name is required")
    .min(2, "Brand name must contains minimum 2 character")
    .max(200, "Brand name must only have 200 characters"),
  description: z
  .string("Description is required")
  .min(10, "Product description must be greater than 10 characters")
    .max(300, "Product description must be greater than 300 characters"),
  quantity: z
    .number("Quantity is required")
    .min(1, "Quantity must be greater than 0")
    .max(99999, "Quantity must be less than 99999"),
  categoryId: number(),
  price: z.number("Price is required")
    .min(1, "Price must be greater than 1")
    .max(999999, "Price must be less than 999999"),
  productAtteibutes: z.string(),
  tags: z.array(z.string()),
  productImages: z.object({
    thumbnailUrl: z.string(),
    imageUrl: z.string(),
    imageId: z.string()
  })
});