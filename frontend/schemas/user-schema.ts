import z from "zod";

export const editUserDetails = z
  .object({
    firstName: z
      .string()
      .min(3, "First name must contains minimum 3 characters")
      .max(50, "First name must contains maximum 50 characters"),
    lastName: z
      .string()
      .min(3, "Last name must contains minimum 3 characters")
      .max(50, "Last name must contains maximum 50 characters"),
    contact: z
      .string()
      .regex(/^[6-9][0-9]{9}$/, "Contact number must be exactly 10 digits")
      .min(10, "Contact number must be 10 digits")
      .max(10, "Contact number must be 10 digits"),
    gender: z.enum(["MALE", "FEMALE", "OTHER", ""]),
    dateOfBirth: z.date().max(new Date(), "Date of birth cannot be in future"),
  })
  .partial();
