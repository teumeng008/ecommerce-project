import { asyncHandler } from '../utils/asyncHandler.js';
import * as userService from '../services/user.service.js';
import * as productService from '../services/product.service.js';
import { productsToDTO } from '../utils/productDTO.js';

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers();
  res.status(200).json({ success: true, count: users.length, users });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const { role } = req.body;
  const user = await userService.updateUserRole(userId, role, req.user.id);
  res.status(200).json({ success: true, message: 'User role updated successfully', user });
});

export const listProductsAdmin = asyncHandler(async (req, res) => {
  const products = await productService.getAllProductsAdmin();
  const dtos = productsToDTO(products, true);
  res.status(200).json({ success: true, count: dtos.length, data: dtos });
});
