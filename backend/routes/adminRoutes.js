import express from 'express';
const router = express.Router();
import {
    getUsers,
    deleteUser,
    createProduct,
    updateProduct,
    deleteProduct,
    getAllOrders,
    updateOrderStatus,
    getRevenueAnalytics,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

router.route('/users').get(protect, admin, getUsers);
router.route('/users/:id').delete(protect, admin, deleteUser);
router.route('/products').post(protect, admin, createProduct);
router.route('/products/:id').put(protect, admin, updateProduct).delete(protect, admin,
    deleteProduct);
router.route('/orders').get(protect, admin, getAllOrders);
router.route('/orders/:id/status').put(protect, admin, updateOrderStatus);
router.route('/analytics/revenue').get(protect, admin, getRevenueAnalytics);

export default router;
