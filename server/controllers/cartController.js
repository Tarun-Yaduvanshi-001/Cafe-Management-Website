import Product from './../models/product.js';
import Cart from './../models/cart.js';

// Helper function to safely calculate the total price of all items in a cart
const calculateTotalPrice = async (cartItems) => {
  let totalPrice = 0;
  // Use Promise.all for efficient database lookups
  await Promise.all(cartItems.map(async (item) => {
    const product = await Product.findById(item.productId);
    if (product) {
      totalPrice += item.quantity * product.price;
    }
  }));
  return totalPrice;
};

export const AddToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id; // Get user ID securely from the token

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [], totalPrice: 0 });
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    // Use the robust helper function to recalculate the total price
    cart.totalPrice = await calculateTotalPrice(cart.items);
    await cart.save();
    
    // Populate product details and return the updated cart to the frontend
    const updatedCart = await Cart.findById(cart._id).populate('items.productId');
    const totalCartItems = updatedCart.items.reduce((acc, item) => acc + item.quantity, 0);

    return res.status(200).json({
      message: 'Item added to cart.',
      cart: updatedCart,
      totalCartItems,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error adding to cart.', error: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    
    if (!cart) {
        return res.status(200).json({
            cart: { items: [], totalPrice: 0 },
            totalCartItems: 0,
        });
    }

    const totalCartItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);

    return res.status(200).json({
      cart,
      totalCartItems,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error getting cart.', error: error.message });
  }
};

export const removeItemFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    // Use the robust helper function to recalculate the total price
    cart.totalPrice = await calculateTotalPrice(cart.items);
    await cart.save();
    
    const updatedCart = await Cart.findById(cart._id).populate('items.productId');
    const totalCartItems = updatedCart.items.reduce((acc, item) => acc + item.quantity, 0);
    
    return res.status(200).json({
      message: 'Item removed from cart.',
      cart: updatedCart,
      totalCartItems,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error removing item from cart.', error: error.message });
  }
};