import { asyncHandler } from "../utils/asyncHandler.js";
import {
  addCategory,
  deleteCategoryById,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
} from "../services/category.service.js";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/AppError.js";

export const listCategories = asyncHandler(async (req, res) => {
    const list = await getAllCategories();
    res.json({list});
});

export const getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await getCategoryById(parseInt(id, 10));
  res.json({ category });
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await addCategory(req.body);
  res.json({ category });
});
export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await updateCategoryById(parseInt(id, 10), req.body);
  res.json({ category });
});
export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await deleteCategoryById(parseInt(id, 10));
  res.json({ message: "Delete a category successfully" });
});
