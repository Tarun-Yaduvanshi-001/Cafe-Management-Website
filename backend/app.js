import express from "express";
import cors from "cors";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// Create the Express app instance
const app = express();

// --- Middleware Configuration ---

// IMPORTANT: The Stripe webhook needs the raw request body.
// This middleware for the webhook route must come BEFORE app.use(express.json()).
app.use("/api/payment/webhook", express.raw({ type: "application/json" }));

// General middleware
app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

// --- API Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);

// Root route for checking if the API is running
app.get("/", (req, res) => {
  res.send("CafeQueue API is running...");
});

// --- Error Handling Middleware ---
// These must be the last middleware to be used
app.use(notFound);
app.use(errorHandler);

export default app;
