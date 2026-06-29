import { getMe, updateMe, passwordMe } from "../controllers/user.controller.js";
import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { updateSchema, changePasswordSchema } from "../validators/auth.validator.js";


const router = express.Router();

router.get("/me",verifyToken ,getMe);
router.put("/me",verifyToken,validate(updateSchema),updateMe);
router.put("/me/password",verifyToken,validate(changePasswordSchema),passwordMe);


export default router;