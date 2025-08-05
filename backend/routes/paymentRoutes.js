import express from 'express';
const router = express.Router();
import {
    createCheckoutSession,
    stripeWebhook,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/create-checkout-session', protect, createCheckoutSession);
router.post('/webhook', stripeWebhook);

export default router;
