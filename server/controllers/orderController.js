import Order from '../models/order.js';

export const createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    if (!order) {
      // This case is unlikely if create() succeeds, but good for safety
      return res.status(400).json({
        message: 'Order not placed',
      });
    }
    // FIX: Added return statement
    return res.status(201).json({
      message: 'Your order is successfully placed',
      order,
    });
  } catch (error) {
    // FIX: Added error handling
    return res.status(500).json({ message: 'Server error creating order.', error: error.message });
  }
};

export const getAllOrder = async (req, res) => {
  try {
    const orders = await Order.find();
    if (!orders || orders.length === 0) {
      return res.status(404).json({
        message: 'No orders found',
      });
    }

    return res.status(200).json({
      message: 'Success',
      data: orders,
    });
  } catch (error) {
    // FIX: Added error handling
    return res.status(500).json({ message: 'Server error getting all orders.', error: error.message });
  }
};

export const getOrderByUserID = async (req, res) => {
  try {
    const { userId } = req.params;
    // FIX: Find by 'userId' field in the schema, not the document's _id
    const orders = await Order.find({ userId: userId });

    // FIX: Check if orders array is empty and use the correct variable name
    if (!orders || orders.length === 0) {
      return res.status(404).json({
        message: 'No orders found for this user.',
      });
    }
    
    return res.status(200).json({
        message: 'Success',
        data: orders,
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Server error getting user orders.',
      error: error.message
    });
  }
};