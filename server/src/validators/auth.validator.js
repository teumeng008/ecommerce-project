import { z } from "zod";

// Helper regex to ensure there are no spaces (whitespaces)
const noSpacesRegex = /^\S+$/;
const noSpacesMessage = "Password must not contain spaces";

export const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  phone: z
    .string()
    .min(9, "Phone Number must have at least 9 numbers")
    .regex(/^0\d+$/, "Invalid phone number format")
    .optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(noSpacesRegex, noSpacesMessage)
    .regex(/[A-Z]/, "Password must have at least 1 uppercase letter")
    .regex(/[a-z]/, "Password must have at least 1 lowercase letter")
    .regex(/[0-9]/, "Password must have at least 1 number"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(noSpacesRegex, noSpacesMessage)
    .regex(/[A-Z]/, "Password must have at least 1 uppercase letter")
    .regex(/[a-z]/, "Password must have at least 1 lowercase letter")
    .regex(/[0-9]/, "Password must have at least 1 number"),
});

export const updateSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .optional(),
    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .optional(),
    email: z.string().email("Invalid email").optional(),
    phone: z
      .string()
      .min(9, "Phone Number must have at least 9 numbers")
      .regex(/^0\d+$/, "Invalid phone number format")
      .optional(),
  })
  .strict();

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(noSpacesRegex, noSpacesMessage)
    .regex(/[A-Z]/, "Password must have at least 1 uppercase letter")
    .regex(/[a-z]/, "Password must have at least 1 lowercase letter")
    .regex(/[0-9]/, "Password must have at least 1 number"),
    
  newPassword: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(noSpacesRegex, noSpacesMessage)
    .regex(/[A-Z]/, "Password must have at least 1 uppercase letter")
    .regex(/[a-z]/, "Password must have at least 1 lowercase letter")
    .regex(/[0-9]/, "Password must have at least 1 number"),
});