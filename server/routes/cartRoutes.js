import express from 'express';
import { AddToCart, getCart, removeItemFromCart } from '../controllers/cartController.js';
import verify from '../middleware/verify.js'; // Import verify middleware

const router = express.Router();

// SECURITY FIX: Protect all cart routes to ensure only authenticated users can access them.
router.use(verify);

router.post('/addToCart', AddToCart);
router.post('/getCart', getCart);
router.post('/removeItem', removeItemFromCart);

export default router;