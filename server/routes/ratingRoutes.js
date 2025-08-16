import express from 'express';
import { addRating } from '../controllers/ratingController.js';
import verify from '../middleware/verify.js';

const router = express.Router();

// All routes in this file are protected
router.use(verify);

router.post('/', addRating);

export default router;