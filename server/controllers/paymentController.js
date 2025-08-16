import Stripe from 'stripe';
import Cart from '../models/cart.js';
import Order from '../models/order.js';
import User from '../models/user.js'; // Import the User model

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ userId }).populate('items.productId');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Your cart is empty.' });
        }

        const line_items = cart.items.map(item => ({
            price_data: {
                currency: 'inr', // Changed to INR
                product_data: {
                    name: item.productId.name,
                },
                unit_amount: Math.round(item.productId.price * 100),
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `http://localhost:5173/order-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:5173/menu`,
            metadata: {
                userId: userId.toString(),
            }
        });

        res.status(200).json({ id: session.id });

    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({ message: 'Server error creating checkout session.' });
    }
};

export const fulfillOrder = async (req, res) => {
    try {
        const { session_id } = req.body;
        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status === 'paid') {
            const userId = session.metadata.userId;
            const cart = await Cart.findOne({ userId });

            if (cart) {
                await Order.create({
                    userId,
                    items: cart.items,
                    totalAmount: cart.totalPrice,
                    paymentStatus: 'Paid',
                    status: 'Pending',
                });

                // Award loyalty points
                const user = await User.findById(userId);
                if (user) {
                    // Award 1 point for every ₹10 spent
                    const pointsEarned = Math.floor(cart.totalPrice / 10);
                    user.loyaltyPoints += pointsEarned;
                    await user.save();
                }

                await Cart.findByIdAndDelete(cart._id);
            }
        }
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error fulfilling order:", error);
        res.status(500).json({ message: 'Server error fulfilling order.' });
    }
};