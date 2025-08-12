import express from 'express';
import { createCheckoutSession, fulfillOrder } from '../controllers/paymentController.js';
import verify from '../middleware/verify.js';

const router = express.Router();

// All routes here are protected
router.use(verify);

router.post('/create-checkout-session', createCheckoutSession);
router.post('/fulfill-order', fulfillOrder);

export default router;