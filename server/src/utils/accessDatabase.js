import { prisma } from "../lib/prisma.js"
import { AppError } from "./AppError.js";


export const accessDatabase = async (req, res, next) =>{
    const user = await prisma.user.findUnique({where:{id : req.user.id}});
    if(!user){
        throw new AppError("User not found",404);
    }
    req.user = user;
    console.log(req.user);
    next();
}