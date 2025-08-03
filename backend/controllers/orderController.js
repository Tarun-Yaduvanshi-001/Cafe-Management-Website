import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";

// @desc Create new order from cart
// @route POST /api/orders
// @access Private
const createOrder = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product"
  );
  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error("No items in cart");
  }

  const orderItems = cart.items.map((item) => ({
    name: item.product.name,
    quantity: item.quantity,
    price: item.product.price,
    product: item.product._id,
  }));

  const totalAmount = cart.totalPrice;
  const order = new Order({
    user: req.user._id,
    items: orderItems,
    totalAmount,
  });

  const createdOrder = await order.save();
  // Clear the cart after order is created
  await Cart.findOneAndUpdate(
    { user: req.user._id },
    { items: [], totalPrice: 0 }
  );
  res.status(201).json(createdOrder);
});

// @desc Get logged in user orders
// @route GET /api/orders/myorders
// @access Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(orders);
});

// @desc Get order by ID
// @route GET /api/orders/:id
// @access Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (
    order &&
    (order.user._id.toString() === req.user._id.toString() ||
      req.user.role === "admin")
  ) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

export { createOrder, getMyOrders, getOrderById };