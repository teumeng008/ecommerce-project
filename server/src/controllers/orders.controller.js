import { checkoutService, getOrdersByIdService, getOrdersService } from "../services/orders.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const checkout = asyncHandler(async (req, res) => {
  const result = await checkoutService(req.user.id, req.body);
  res.json({ message: "Purchase successfully", cart: result });
});

export const getOrders = asyncHandler(async (req, res) => {
    const orders = await getOrdersService(req.user.id);
    res.json({orders});
});

export const getOrdersById = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const order = await getOrdersByIdService(req.user.id, parseInt(id, 10));
    res.json({order});
});
