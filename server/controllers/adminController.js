import User from '../models/user.js';
import Order from '../models/order.js';
import Product from '../models/product.js';

export const getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' }).select('-password');
    res.status(200).json({ success: true, customers });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ message: 'Server error fetching customers.', error: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'name').populate('items.productId', 'name price');
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error fetching orders.', error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found.' });
        }
        res.status(200).json({ success: true, order: updatedOrder });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Server error updating order status.', error: error.message });
    }
};

export const getAnalytics = async (req, res) => {
    try {
        const totalCustomers = await User.countDocuments({ role: 'customer' });
        const totalOrders = await Order.countDocuments();
        const totalRevenueResult = await Order.aggregate([
            { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
        ]);
        const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].totalRevenue : 0;
        
        const topItemsResult = await Order.aggregate([
            { $unwind: '$items' },
            { $group: { _id: '$items.productId', totalOrders: { $sum: '$items.quantity' } } },
            { $sort: { totalOrders: -1 } },
            { $limit: 4 },
            { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'productDetails' } },
            { $unwind: '$productDetails' },
            { $project: { name: '$productDetails.name', orders: '$totalOrders', revenue: { $multiply: ['$totalOrders', '$productDetails.price'] } } }
        ]);

        const analytics = {
            dailyRevenue: totalRevenue,
            dailyOrders: totalOrders,
            totalCustomers: totalCustomers,
            averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
            topItems: topItemsResult
        };

        res.status(200).json({ success: true, analytics });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ message: 'Server error fetching analytics.', error: error.message });
    }
};

export const createOrder = async (req, res) => {
    try {
        const newOrder = await Order.create(req.body);
        const populatedOrder = await Order.findById(newOrder._id).populate('userId', 'name').populate('items.productId', 'name price');
        res.status(201).json({ success: true, order: populatedOrder });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Server error creating order.', error: error.message });
    }
};