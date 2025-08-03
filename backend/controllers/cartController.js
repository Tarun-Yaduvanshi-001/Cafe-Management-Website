import asyncHandler from "express-async-handler";
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

// @desc Get user's cart
// @route GET /api/cart
// @access Private
const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
    "name price imageUrl"
  );
  if (cart) {
    res.json(cart);
  } else {
    // If no cart, create one
    const newCart = await Cart.create({ user: req.user._id });
    res.json(newCart);
  }
});

// @desc Add item to cart
// @route POST /api/cart
// @access Private
const addItemToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const user = req.user._id;
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  let cart = await Cart.findOne({ user });
  if (!cart) {
    cart = new Cart({ user, items: [] });
  }
  const itemIndex = cart.items.findIndex(
    (p) => p.product.toString() === productId
  );
  if (itemIndex > -1) {
    // Product exists in cart, update quantity
    cart.items[itemIndex].quantity += quantity;
  } else {
    // Product not in cart, add new item
    cart.items.push({ product: productId, quantity, price: product.price });
  }
  // Recalculate total price
  cart.totalPrice = cart.items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  await cart.save();
  const populatedCart = await cart.populate(
    "items.product",
    "name price imageUrl"
  );
  res.status(201).json(populatedCart);
});

// @desc Update cart item quantity
// @route PUT /api/cart/:itemId
// @access Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const { itemId } = req.params;
  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    const item = cart.items.find((p) => p._id.toString() === itemId);
    if (item) {
      item.quantity = quantity;
      cart.totalPrice = cart.items.reduce(
        (acc, item) => acc + item.quantity * item.price,
        0
      );
      await cart.save();
      const populatedCart = await cart.populate(
        "items.product",
        "name price imageUrl"
      );
      res.json(populatedCart);
    } else {
      res.status(404);
      throw new Error("Item not found in cart");
    }
  } else {
    res.status(404);
    throw new Error("Cart not found");
  }
});

// @desc Remove item from cart
// @route DELETE /api/cart/:itemId
// @access Private
const removeItemFromCart = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { items: { _id: itemId } } },
    { new: true }
  );
  if (cart) {
    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    );
    await cart.save();
    const populatedCart = await cart.populate(
      "items.product",
      "name price imageUrl"
    );
    res.json(populatedCart);
  } else {
    res.status(404);
    throw new Error("Cart not found");
  }
});

export { getCart, addItemToCart, updateCartItem, removeItemFromCart };
