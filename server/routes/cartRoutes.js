import express from 'express';
import { AddToCart, getCart, removeItemFromCart, updateCartItemQuantity } from '../controllers/cartController.js';
import verify from '../middleware/verify.js';

const router = express.Router();

// All cart routes should be protected
router.use(verify);

router.post('/addToCart', AddToCart);
// FIX: Change this from .post to .get to match the frontend request
router.get('/getCart', getCart);
router.post('/removeItem', removeItemFromCart);
router.put('/updateQuantity', updateCartItemQuantity);

export default router;