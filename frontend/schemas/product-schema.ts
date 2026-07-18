import { z } from "zod";

export const addProductSchema = z.object({
  brandName: z
    .string("Brand name is required")
    .min(2, "Brand name must contain a minimum of 2 characters")
    .max(200, "Brand name must not exceed 200 characters"),

  description: z
    .string("Description is required")
    .min(10, "Product description must be at least 10 characters")
    .max(300, "Product description must not exceed 300 characters"),

  quantity: z
    .number("Quantity is required")
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be greater than 0")
    .max(99999, "Quantity must be less than 99999"),

  categoryId: z.string("Category is required"),

  price: z
    .number("Price is required")
    .min(1, "Price must be greater than 1")
    .max(999999, "Price must be less than 999999"),

  productImages: z
    .array(
      z.object({
        thumbnailUrl: z.string(),
        imageUrl: z.string(),
        imageId: z.string(),
        priority: z.number(),
        isThumbnail: z.boolean(),
      })
    )
    .min(1, "At least one product image is required"),

  productAttributes: z.array(
    z.object({
      attributeName: z.string(),
      attributeValue: z.string(),
    })
  ),

  tags: z.array(z.string()),
});

export const editProductSchema = z.object({
  description: z
    .string("Description is required")
    .min(10, "Product description must be at least 10 characters")
    .max(300, "Product description must not exceed 300 characters"),

    quantity: z
    .number("Quantity is required")
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be greater than 0")
    .max(99999, "Quantity must be less than 99999"),
});