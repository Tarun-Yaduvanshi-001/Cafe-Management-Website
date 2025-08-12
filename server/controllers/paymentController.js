import Stripe from 'stripe';
import Cart from '../models/cart.js';
import Order from '../models/order.js';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ userId }).populate('items.productId');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Your cart is empty.' });
        }

        // Format cart items for Stripe
        const line_items = cart.items.map(item => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.productId.name,
                    // You can add images here if your product model has them
                    // images: [item.productId.image],
                },
                unit_amount: Math.round(item.productId.price * 100), // Price in cents
            },
            quantity: item.quantity,
        }));

        // Create a checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `http://localhost:5173/order-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:5173/menu`,
            // Pass the userId in metadata to create the order later
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

// This function will be used with a webhook later for more robust order creation,
// but for a dummy system, we can create the order on success redirect.
export const fulfillOrder = async (req, res) => {
    try {
        const { session_id } = req.body;
        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status === 'paid') {
            const userId = session.metadata.userId;
            const cart = await Cart.findOne({ userId });

            if (cart) {
                // Create a new order from the cart details
                await Order.create({
                    userId,
                    items: cart.items,
                    totalAmount: cart.totalPrice,
                    paymentStatus: 'Paid',
                    status: 'Pending',
                });

                // Clear the user's cart
                await Cart.findByIdAndDelete(cart._id);
            }
        }
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error fulfilling order:", error);
        res.status(500).json({ message: 'Server error fulfilling order.' });
    }
};