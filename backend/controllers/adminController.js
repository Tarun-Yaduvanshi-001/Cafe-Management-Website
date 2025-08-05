import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';


// --- User Management ---
// @desc Get all users
// @route GET /api/admin/users
// @access Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password');
    res.json(users);
});


// @desc Delete user
// @route DELETE /api/admin/users/:id
// @access Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        await user.deleteOne();
        res.json({ message: 'User removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});


// --- Product Management ---
// @desc Create a product
// @route POST /api/admin/products
// @access Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const { name, price, description, category, imageUrl } = req.body;
    const product = new Product({
        name,
        price,
        user: req.user._id,
        imageUrl: imageUrl || '/images/sample.jpg',
        category,
        description,
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});


// @desc Update a product
// @route PUT /api/admin/products/:id
// @access Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const { name, price, description, category, imageUrl } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
        product.name = name;
        product.price = price;
        product.description = description;
        product.category = category;
        product.imageUrl = imageUrl;
        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});


// @desc Delete a product
// @route DELETE /api/admin/products/:id
// @access Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// --- Order Management ---
// @desc Get all orders
// @route GET /api/admin/orders
// @access Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name').sort({ createdAt: -1 });
    res.json(orders);
});


// @desc Update order status
// @route PUT /api/admin/orders/:id/status
// @access Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        order.status = req.body.status;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});


// --- Analytics ---
// @desc Get revenue analytics
// @route GET /api/admin/analytics/revenue
// @access Private/Admin
const getRevenueAnalytics = asyncHandler(async (req, res) => {
    const { timeFrame } = req.query; // 'day', 'week', 'month'
    let startDate = new Date();
    if (timeFrame === 'day') {
        startDate.setHours(0, 0, 0, 0);
    } else if (timeFrame === 'week') {
        startDate.setDate(startDate.getDate() - 7);
    } else if (timeFrame === 'month') {
        startDate.setMonth(startDate.getMonth() - 1);
    } else {
        // Default to all time
        startDate = new Date(0);
    }
    const paidOrders = await Order.find({
        'paymentDetails.paymentStatus': 'Paid',
        createdAt: { $gte: startDate },
    }).populate('items.product', 'category');
    const revenueByCategory = paidOrders.reduce((acc, order) => {
        order.items.forEach(item => {
            const category = item.product ? item.product.category : 'Uncategorized';
            const revenue = item.price * item.quantity;
            if (!acc[category]) {
                acc[category] = 0;
            }
            acc[category] += revenue;
        });
        return acc;
    }, {});
    const totalRevenue = Object.values(revenueByCategory).reduce((sum, val) => sum +
        val, 0);
    res.json({
        totalRevenue,
        revenueByCategory,
        timeFrame,
        startDate,
    });
});

export {
    getUsers, deleteUser, createProduct, updateProduct, deleteProduct, getAllOrders, updateOrderStatus, getRevenueAnalytics,
};