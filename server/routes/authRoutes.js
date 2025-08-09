import express from 'express';
import { authenticateGoogleLogin, login, logout, signup, verifyUser } from '../controllers/AuthController.js';
import verify from '../middleware/verify.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/verify-google', authenticateGoogleLogin);
router.post('/logout', logout);
router.post('/verify', verify, verifyUser); // Re-add the verify route

export default router;