import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { addCartItemSchema, editCartItemSchema } from "../validators/cart.validator.js";
import { addCartItem, getCart, updateCartItem, deleteCartItem, clearCart } from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/cart",verifyToken,getCart);
router.post("/cart/items/:productId",verifyToken,validate(addCartItemSchema),addCartItem);
router.put("/cart/items/:productId",verifyToken,validate(editCartItemSchema),updateCartItem);
router.delete("/cart/items/:productId",verifyToken,deleteCartItem);
router.delete("/cart",verifyToken,clearCart);

export default router;