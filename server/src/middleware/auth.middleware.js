import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";

export const verifyToken = (req, res, next) => {
  // console.log(req.headers);
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new AppError("Unauthorized", 401));
  }

  const token = authHeader.split(" ")[1]; // when user make req they should always give authHeader(EX: Bearer "token")
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded JWT:", decode);

    req.user = decode;

    console.log(req.user)
    next();

  } catch (error) {
    return next(new AppError(error.message || "Unauthorized", 401));
  }
};
