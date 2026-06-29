import { z } from "zod";

export const addCartItemSchema = z.object({
    // cardId : z.number({message : "cardId should be number"}).int({message : "cardId should not has float number"}).positive({message : "cardId should be positive number"}),
    // productId : z.number({message : "productId should be number"}).int({message : "productId should not has float number"}).positive({message : "productId should be positive number"}),
    quantity : z.number({message : "quantity should be number"}).int({message : "quantity should not has float number"}).positive({message : "quantity should be positive number"})
});

export const editCartItemSchema = addCartItemSchema.partial().strict();