import z from "zod";

export const addressFormSchema = z.object({
  address: z
    .string()
    .min(10, "Address must contains minimum 10 characters")
    .max(200, "Address must contains maximum 200 characters"),
  street: z
    .string()
    .min(5, "Street must contains minimum 5 characters")
    .max(100, "Street must contains maximum 100 characters"),
  city: z
    .string()
    .min(3, "City must contains minimum 3 characters")
    .max(50, "City must contains maximum 50 characters"),
  state: z
    .string()
    .min(3, "State must contains minimum 3 characters")
    .max(50, "State must contains maximum 50 characters"),
  postalCode: z
    .string()
    .regex(/^[0-9]{6}$/, "Postal code must be exactly 6 digits")
    .min(6, "Postal code must be 6 digits")
    .max(6, "Postal code must be 6 digits"),
  country: z
    .string()
    .min(3, "Country must contains minimum 3 characters")
    .max(50, "Country must contains maximum 50 characters"),
});
