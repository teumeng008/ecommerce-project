import slugify from "slugify";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/AppError.js";

export async function getCategoryById(id) {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    throw new AppError("Category not found", 404);
  }
  return category;
}

export async function getAllCategories() {
  const categories = await prisma.category.findMany();
  return categories;
}

export async function addCategory(data) {
  const { name, image } = data;
  const slug = slugify(name, { lower: true, strict: true });
  const isExited = await prisma.category.findUnique({ where: { slug } });
  console.log(isExited);
  if (isExited) {
    throw new AppError("Category already exists", 409);
  }

  const create = await prisma.category.create({
    data: {
      name: name,
      slug: slug,
      image: image || null,
    },
  });
  return create;
}
export async function updateCategoryById(id, newData) {
    
  const { name, image } = newData;
  const slug = slugify(name, { lower: true, strict: true });
  const isExited = await prisma.category.findUnique({ where: { id } });
  if (!isExited) {
    throw new AppError("Category not found", 404);
  }
  const update = await prisma.category.update({
    where: { id },
    data: {
      name: name,
      slug: slug,
      image: image || null,
    },
  });
  return update;
}
export async function deleteCategoryById(id) {
  const productCount = await prisma.product.count({
    where: { categoryId: id },
  });
  if (productCount > 0) {
    throw new AppError(
      `Can't delete category. It still contain ${productCount} products`,
      400,
    );
  }
  await prisma.category.delete({ where: { id } });
}
