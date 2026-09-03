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

export const resetPasswordSchema = z
  .object({
    password: z.string().min(10, "Password must be at least 10 characters"),
    newPassword: z.string().min(10, "Password must be at least 10 characters"),
    confirmNewPassword: z.string().min(10, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });
