import {
  getProductById,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/product.service.js";
import { productToDTO, productsToDTO } from "../utils/productDTO.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createProductSchema, updateProductSchema } from "../validators/product.validator.js";

/**
 * GET /product/:id
 * Fetch a single product by ID
 */
export const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await getProductById(parseInt(id, 10));
  const dto = productToDTO(product, true); // Include category info

  res.status(200).json({
    success: true,
    data: dto,
  });
});

/**
 * GET /product
 * Fetch all active products
 */
export const listProducts = asyncHandler(async (req, res) => {
  const products = await getAllProducts();
  const dtos = productsToDTO(products, true);

  res.status(200).json({
    success: true,
    count: dtos.length,
    data: dtos,
  });
});

/**
 * POST /product
 * Create a new product (ADMIN only)
 * Body: { name, description, price, stock, categoryId, thumbnail? }
 */
export const addProduct = asyncHandler(async (req, res) => {
  // Validate request body
  const validatedData = createProductSchema.parse(req.body);

  const product = await createProduct(validatedData);
  const dto = productToDTO(product, true);

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: dto,
  });
});

/**
 * PUT /product/:id
 * Update a product by ID (ADMIN only)
 * Body: { name?, description?, price?, stock?, categoryId?, thumbnail?, isActive? }
 */
export const editProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
    // console.log(req.params);
  // Validate request body (all fields optional)
  const validatedData = updateProductSchema.parse(req.body);

  const product = await updateProduct(parseInt(id, 10), validatedData); //parseInt(id, 10) convert string to number using base-10
  const dto = productToDTO(product, true);

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: dto,
  });
});

/**
 * DELETE /product/:id
 * Delete a product by ID (ADMIN only)
 */
export const deleteProductHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await deleteProduct(parseInt(id, 10));

  res.status(204).send();
});
