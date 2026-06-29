import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as service from "../services/user.service.js";

export const getMe = asyncHandler (async (req, res) => {
        const user = await service.getMe(req.user.id);
        res.json({success: true, message: "Fetch successfully",user});
});

export const updateMe = asyncHandler(async (req, res) =>{
        const user = await service.updateMe(req.user.id, req.body);
        res.json({success: true, message: "Updated successfully",user});
});

export const passwordMe = asyncHandler(async (req, res) =>{
        await service.passwordMe(req.user.id, req.body);
        res.json({success: true, message: "Password changed successfully"});
});