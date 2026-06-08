import z from "zod";

export const registerFormSchema = z
  .object({
    email: z
      .email("Please enter a valid email address")
      .min(5, "Email should be greater than 5 characters")
      .max(100, "Email should be less than 100 characters"),
    firstName: z
      .string()
      .min(3, "First name should be at least 3 characters")
      .max(50, "First name should be less than 50 characters"),
    password: z.string().min(10, "Password must be at least 10 characters"),
    confirmPassword: z.string().min(10, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginFormSchema = z.object({
  email: z
    .email("Please enter a valid email address")
    .min(5, "Email should be greater than 5 characters")
    .max(100, "Email should be less than 100 characters"),

  password: z.string().min(10, "Password must be at least 10 characters"),
});

export const verifyFormSchema = z.object({
  otp: z
    .string()
    .regex(/^\d{6}$/, "OTP must be exactly 6 digits")
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits"),
});

export const sellerRegistrationFormSchema = z.object({
  shopName: z
    .string()
    .min(5, "Shop name must contains minimum 5 characters")
    .max(100, "Shop name must contains maximum 100 characters"),
  description: z
    .string()
    .min(10, "Shop description must contains minimum 10 characters")
    .max(200, "Shop description must contains maximum 200 characters"),
  category: z.enum([
    "ELECTRONICS",
    "FASHION",
    "GROCERY",
    "BOOKS",
    "FURNITURE"
  ])
})

export const sellerVerificationFormSchema = z.object({
  gstNo: z.string()
    .regex(/^[0-9]{15}$/, "GST number must be exactly 15 digits")
    .min(15, "GST number must be 15 digits")
    .max(15, "GST number must be 15 digits"),
  panNo: z.string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Pan number must be exactly 10 digits")
    .min(10, "Pan number must be 10 digits")
    .max(10, "Pan number must be 10 digits"),
})

export const addressFormSchema = z.object({
  address: z.string()
    .min(10, "Address must contains minimum 10 characters")
    .max(200, "Address must contains maximum 200 characters"),
  street: z.string()
    .min(5, "Street must contains minimum 5 characters")
    .max(100, "Street must contains maximum 100 characters"),
  city: z.string()
    .min(3, "City must contains minimum 3 characters")
    .max(50, "City must contains maximum 50 characters"),
  state: z.string()
    .min(3, "State must contains minimum 3 characters")
    .max(50, "State must contains maximum 50 characters"),
  postalCode: z.string()
    .regex(/^[0-9]{6}$/, "Postal code must be exactly 6 digits")
    .min(6, "Postal code must be 6 digits")
    .max(6, "Postal code must be 6 digits"),
  country: z.string()
    .min(3, "Country must contains minimum 3 characters")
    .max(50, "Country must contains maximum 50 characters"),
})
