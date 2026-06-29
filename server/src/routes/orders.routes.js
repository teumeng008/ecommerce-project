import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { checkout, getOrders, getOrdersById } from "../controllers/orders.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { orderSchema } from "../validators/orders.validator.js";


const router = express.Router();

router.post("/orders/checkout", verifyToken, validate(orderSchema), checkout);
router.get("/orders",verifyToken, getOrders);
router.get("/orders/:id",verifyToken, getOrdersById); 

export default router;