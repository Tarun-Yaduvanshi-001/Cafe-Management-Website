import express from "express";
const router = express.Router();
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

router.route("/").get(protect, getCart).post(protect, addItemToCart);
router
  .route("/:itemId")
  .put(protect, updateCartItem)
  .delete(protect, removeItemFromCart);

export default router;