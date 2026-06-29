import express from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/authorize.middleware.js';
import { getAllUsers, updateUserRole } from '../controllers/admin.controller.js';
// import { listProductsAdmin } from '../controllers/product.controller.js';
import { listProductsAdmin } from '../controllers/admin.controller.js';

const router = express.Router();

router.get('/users', verifyToken, authorize('ADMIN'), getAllUsers);
router.put('/users/:id/role', verifyToken, authorize('ADMIN'), updateUserRole);
router.get('/products', verifyToken, authorize('ADMIN'), listProductsAdmin);

export default router;
