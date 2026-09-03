import z from "zod";

export const walletRegistrationSchema = z
  .object({
    mPin: z
      .string("MPIN is required for wallet registration")
      .min(4, "MPIN should contains 4 digits")
      .max(4, "MPIN should contains 4 digits"),
    confirmMPin: z
      .string("MPIN is required for wallet registration")
      .min(4, "MPIN should contains 4 digits")
      .max(4, "MPIN should contains 4 digits"),
  })
  .refine((data) => data.mPin === data.confirmMPin, {
    error: "MPIN not match",
    path: ["confirmMPin"],
  });

export const mPinScehma = z.object({
  mPin: z
    .string("MPIN is required to access wallet")
    .min(4, "MPIN should contains 4 digits")
    .max(4, "MPIN should contains 4 digits"),
});