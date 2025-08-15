import Order from '../models/order.js';
import User from '../models/user.js';

// Get all orders for the currently logged-in user
export const getUserOrders = async (req, res) => {
  try {
    // The user's ID is available from the 'verify' middleware
    const userId = req.user.id;
    const orders = await Order.find({ userId: userId })
      .populate('items.productId', 'name price image') // Get details for each product in the order
      .sort({ orderTime: -1 }); // Show the most recent orders first

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Server error fetching user orders.', error: error.message });
  }
};