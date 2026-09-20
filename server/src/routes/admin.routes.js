import express from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/authorize.middleware.js';
import { getAllUsers, updateUserRole } from '../controllers/admin.controller.js';
// import { listProductsAdmin } from '../controllers/product.controller.js';
import { listProductsAdmin } from '../controllers/admin.controller.js';

const router = express.Router();

router.get('/users', verifyToken, authorize('OWNER', 'ADMIN'), getAllUsers);
router.put('/users/:id/role', verifyToken, authorize('OWNER'), updateUserRole);
router.get('/products', verifyToken, authorize('OWNER', 'ADMIN'), listProductsAdmin);

export default router;
