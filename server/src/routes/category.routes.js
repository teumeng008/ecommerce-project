import express from "express";
import { createCategory, deleteCategory, getCategory, listCategories, updateCategory } from "../controllers/category.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { createCategorySchema, updateCategorySchema } from "../validators/category.validator.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/categories",listCategories);
router.get("/categories/:id", getCategory);
router.post("/categories",verifyToken,validate(createCategorySchema),createCategory);
router.put("/categories/:id",verifyToken,validate(updateCategorySchema),updateCategory);
router.delete("/categories/:id",verifyToken, deleteCategory);

export default router;