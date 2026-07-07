import z from "zod";

export const sellerRegistrationFormSchema = z.object({
  shopName: z
    .string()
    .min(5, "Shop name must contains minimum 5 characters")
    .max(100, "Shop name must contains maximum 100 characters"),
  description: z
    .string()
    .min(10, "Shop description must contains minimum 10 characters")
    .max(200, "Shop description must contains maximum 200 characters"),
  category: z.enum(["ELECTRONICS", "FASHION", "GROCERY", "BOOKS", "FURNITURE"]),
});

export const sellerVerificationFormSchema = z.object({
  gstNo: z
    .string()
    .regex(/^[0-9]{15}$/, "GST number must be exactly 15 digits")
    .min(15, "GST number must be 15 digits")
    .max(15, "GST number must be 15 digits"),
  panNo: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Pan number must be exactly 10 digits")
    .min(10, "Pan number must be 10 digits")
    .max(10, "Pan number must be 10 digits"),
});
