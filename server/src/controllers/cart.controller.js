import { asyncHandler } from "../utils/asyncHandler.js";
import { getCartUser } from "../services/cart.service.js";
import { addCartItemById, updateCartItemById, deleteCartItemById, clearCartById } from "../services/cart.service.js";


export const getCart = asyncHandler( async(req, res) =>{
    const cart = await getCartUser(req.user.id);
    res.json({cart});
});

export const addCartItem = asyncHandler(async(req, res) =>{
    const {productId} = req.params;
    const newCard = await addCartItemById(req.user.id, parseInt(productId, 10), req.body);
    res.json({cart : newCard})
});

export const updateCartItem = asyncHandler(async(req, res) => {
    const {productId} = req.params;
    const updatedCart = await updateCartItemById(req.user.id,parseInt(productId, 10), req.body);
    res.json({cart : updatedCart});
});

export const deleteCartItem = asyncHandler(async(req, res) =>{
    const {productId} = req.params;
    await deleteCartItemById(req.user.id, parseInt(productId, 10));
    res.json({ message : `Delete product's id: ${parseInt(productId, 10)} successfully.`});
});

export const clearCart = asyncHandler( async(req, res) =>{
    await clearCartById(req.user.id);
    res.json({message : `User ${req.user.id}'s cart has been cleared successfully.`});
});