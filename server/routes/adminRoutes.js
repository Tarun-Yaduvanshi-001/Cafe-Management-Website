import express from 'express';
import verify from '../middleware/verify.js';
import { getAllCustomers, getAllOrders, getAnalytics, updateOrderStatus, createOrder } from '../controllers/adminController.js';
import { createProduct, updateProduct, deleteProduct, getAllAdminProducts  } from '../controllers/productController.js';

const router = express.Router();

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
};

router.use(verify, isAdmin);

// Customer routes
router.get('/customers', getAllCustomers);

// Order routes
router.get('/orders', getAllOrders);
router.post('/orders', createOrder);
router.put('/orders/:orderId/status', updateOrderStatus);

// Analytics route
router.get('/analytics', getAnalytics);

// Menu (Product) management routes
router.get('/menu', getAllAdminProducts);
router.post('/menu', createProduct);
router.put('/menu/:id', updateProduct);
router.delete('/menu/:id', deleteProduct);

export default router;