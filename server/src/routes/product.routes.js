import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { accessDatabase } from "../utils/accessDatabase.js";
import { authorize } from "../middleware/authorize.middleware.js";
import {
  getProduct,
  listProducts,
  addProduct,
  editProduct,
  deleteProductHandler,
} from "../controllers/product.controller.js";

const router = express.Router();

/**
 * Public route - Get single product
 * GET /product/:id
 */
router.get("/product/:id", getProduct);

/**
 * Public route - List all products
 * GET /product
 */
router.get("/product", listProducts);

/**
 * Admin only - Create product
 * POST /product
 */
router.post("/product", verifyToken, accessDatabase, authorize("OWNER", "ADMIN"), addProduct);

/**
 * Admin only - Update product
 * PUT /product/:id
 */
router.put("/product/:id", verifyToken, accessDatabase, authorize("OWNER", "ADMIN"), editProduct);

/**
 * Admin only - Delete product
 * DELETE /product/:id
 */
router.delete("/product/:id", verifyToken, accessDatabase, authorize("OWNER", "ADMIN"), deleteProductHandler);

export default router;
