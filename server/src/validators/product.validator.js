import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters").max(191),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().positive("Price must be greater than 0"),
  stock: z.number().int().nonnegative("Stock must be a non-negative number"),
  categoryId: z.number().int().positive("Valid category ID is required"),
  thumbnail: z.string().url("Thumbnail must be a valid URL").optional(),
});

export const updateProductSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters").max(191).optional(),
  description: z.string().min(10, "Description must be at least 10 characters").optional(),
  price: z.number().positive("Price must be greater than 0").optional(),
  stock: z.number().int().nonnegative("Stock must be a non-negative number").optional(),
  categoryId: z.number().int().positive("Valid category ID is required").optional(),
  thumbnail: z.string().url("Thumbnail must be a valid URL").optional(),
  isActive: z.boolean().optional(),
});
