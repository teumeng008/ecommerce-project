import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/AppError.js";


export const authorize = (...role ) =>{
    return async(req, res, next) => {
        const user = await prisma.user.findUnique({where : {id : req.user.id}});
        if(!role.includes(user.role)){
            throw new AppError("forbidden", 403);
        }
        next();
    }
};