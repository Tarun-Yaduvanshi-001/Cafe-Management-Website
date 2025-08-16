import Order from '../models/order.js';
import Product from '../models/product.js';
import Rating from '../models/rating.js';

export const addRating = async (req, res) => {
    try {
        const { orderId, productId, rating } = req.body;
        const userId = req.user.id;

        const order = await Order.findById(orderId);
        if (!order || order.userId.toString() !== userId) {
            return res.status(404).json({ message: 'Order not found or you are not authorized.' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        const orderItem = order.items.find(item => item.productId.toString() === productId);
        if (!orderItem) {
            return res.status(400).json({ message: 'Product not found in this order.' });
        }
        if (orderItem.isRated) {
            return res.status(400).json({ message: 'You have already rated this item for this order.' });
        }

        const newRating = await Rating.create({
            product: productId,
            user: userId,
            rating: rating,
        });

        product.ratings.push(newRating._id);
        product.numReviews = product.ratings.length;

        const allRatings = await Rating.find({ _id: { $in: product.ratings } });
        product.averageRating = allRatings.reduce((acc, item) => item.rating + acc, 0) / allRatings.length;
        
        await product.save();

        // FIX: Mark the item as rated AND store the rating value
        orderItem.isRated = true;
        orderItem.rating = rating;
        await order.save();

        res.status(201).json({ success: true, message: 'Thank you for your review!', product });

    } catch (error) {
        console.error("Error adding rating:", error);
        res.status(500).json({ message: 'Server error adding rating.', error: error.message });
    }
};