import express from "express";
const router = express.Router();
import {
  registerUser,
  loginUser,
  googleSignIn,
} from "../controllers/authController.js";


router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google-signin", googleSignIn);


export default router;
