import Product from './../models/product.js';
import Cart from './../models/cart.js';

const calculateTotalPrice = async (cartItems) => {
  let totalPrice = 0;
  await Promise.all(cartItems.map(async (item) => {
    const product = await Product.findById(item.productId);
    if (product) {
      totalPrice += item.quantity * product.price;
    }
  }));
  return totalPrice;
};

// ADD THIS NEW FUNCTION TO HANDLE INCREMENT/DECREMENT
export const updateCartItemQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    if (quantity < 1) {
      // This logic could also be used to remove the item if you prefer
      return res.status(400).json({ message: 'Quantity must be at least 1.' });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    const itemToUpdate = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (!itemToUpdate) {
      return res.status(404).json({ message: 'Item not found in cart.' });
    }

    itemToUpdate.quantity = quantity;

    cart.totalPrice = await calculateTotalPrice(cart.items);
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate('items.productId');
    const totalCartItems = updatedCart.items.reduce((acc, item) => acc + item.quantity, 0);

    return res.status(200).json({
      message: 'Cart updated.',
      cart: updatedCart,
      totalCartItems,
    });
  } catch (error) {
    console.error('ERROR in updateCartItemQuantity:', error);
    return res.status(500).json({ message: 'Server error updating cart quantity.', error: error.message });
  }
};

// --- (The other functions: AddToCart, getCart, removeItemFromCart are unchanged) ---
export const AddToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;
    const product = await Product.findById(productId);
    if (!product) { return res.status(404).json({ message: 'Product not found.' }); }
    let cart = await Cart.findOne({ userId });
    if (!cart) { cart = new Cart({ userId, items: [], totalPrice: 0 }); }
    const existingItem = cart.items.find((item) => item.productId.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }
    cart.totalPrice = await calculateTotalPrice(cart.items);
    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate('items.productId');
    const totalCartItems = updatedCart.items.reduce((acc, item) => acc + item.quantity, 0);
    return res.status(200).json({
      message: 'Item added to cart.',
      cart: updatedCart,
      totalCartItems,
    });
  } catch (error) {
    console.error('ERROR in AddToCart:', error); 
    return res.status(500).json({ message: 'Server error adding to cart.', error: error.message });
  }
};
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) {
        return res.status(200).json({ cart: { items: [], totalPrice: 0 }, totalCartItems: 0 });
    }
    const totalCartItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
    return res.status(200).json({ cart, totalCartItems });
  } catch (error) {
    console.error('ERROR in getCart:', error);
    return res.status(500).json({ message: 'Server error getting cart.', error: error.message });
  }
};
export const removeItemFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;
    let cart = await Cart.findOne({ userId });
    if (!cart) { return res.status(404).json({ message: 'Cart not found.' }); }
    cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
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
    console.error('ERROR in removeItemFromCart:', error);
    return res.status(500).json({ message: 'Server error removing item from cart.', error: error.message });
  }
};