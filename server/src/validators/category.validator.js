import { z } from "zod";

export const createCategorySchema = z.object({
    name : z.string().min(2,"Category's name must has 2 character at least"),
    image : z.string().url().optional(),
});

export const updateCategorySchema = createCategorySchema.partial().strict(); // it take the same format as createCategorySchema but everything is optional