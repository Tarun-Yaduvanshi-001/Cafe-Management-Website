import express from 'express';
import { getUserOrders } from '../controllers/userController.js';
import verify from '../middleware/verify.js';

const router = express.Router();

// All routes in this file are protected and require a valid login
router.use(verify);

// Route to get the current user's orders
router.get('/orders', getUserOrders);

export default router;