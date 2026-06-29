import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/AppError.js";

/**
 * Get all active products
 */
export async function getAllProducts() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  return products;
}

export async function getAllProductsAdmin() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  return products;
}

/**
 * Get a single product by ID
 */
export async function getProductById(id) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product;
}

/**
 * Create a new product
 * Validates that category exists
 */
export async function createProduct(data) {
  const { name, description, price, stock, categoryId, thumbnail } = data;

  // Verify category exists
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  // Generate slug from name (simple version: lowercase + replace spaces with hyphens)
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");

  // Check if slug already exists
  const existingProduct = await prisma.product.findUnique({
    where: { slug },
  });

  if (existingProduct) {
    throw new AppError("Product slug already exists", 400);
  }

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      categoryId,
      thumbnail: thumbnail || null,
      isActive: true,
    },
    include: { category: true },
  });

  return product;
}

/**
 * Update a product by ID
 */
export async function updateProduct(id, data) {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  // If categoryId is being updated, verify it exists
  if (data.categoryId && data.categoryId !== product.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      throw new AppError("Category not found", 404);
    }
  }

  // Prepare update data
  const updateData = {};
  if (data.name) {
    updateData.name = data.name;
    // Regenerate slug if name changed
    updateData.slug = data.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
  }
  if (data.description) updateData.description = data.description;
  if (data.price) updateData.price = parseFloat(data.price);
  if (data.stock !== undefined) updateData.stock = parseInt(data.stock, 10);
  if (data.categoryId) updateData.categoryId = data.categoryId;
  if (data.thumbnail !== undefined) updateData.thumbnail = data.thumbnail;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: updateData,
    include: { category: true },
  });

  return updatedProduct;
}

/**
 * Delete a product by ID (hard delete)
 */
export async function deleteProduct(id) {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  // Also delete associated product images and cart items
  await prisma.cartItem.deleteMany({
    where: { productId: id },
  });

  await prisma.productImage.deleteMany({
    where: { productId: id },
  });

  await prisma.orderItem.deleteMany({
    where: { productId: id },
  });

  await prisma.product.delete({
    where: { id },
  });

  return { message: "Product deleted successfully" };
}