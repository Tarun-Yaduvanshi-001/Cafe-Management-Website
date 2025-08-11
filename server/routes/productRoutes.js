import express from 'express';
import { getAllProduct } from '../controllers/productController.js';
import verify from '../middleware/verify.js';

const router = express.Router();

// This route will fetch all available products
// We add the 'verify' middleware to ensure only logged-in users can see the menu
router.get('/', verify, getAllProduct);

export default router;