import { z } from "zod";

export const orderSchema = z.object({
  shippingAddress: z.string("address must be texts").optional(),
  phone: z
    .string()
    .min(9, "Phone Number must have at least 9 numbers")
    .regex(/^0\d+$/, "Invalid phone number format"),
});
