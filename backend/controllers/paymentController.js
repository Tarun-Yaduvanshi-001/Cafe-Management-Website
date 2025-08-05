import asyncHandler from 'express-async-handler';
import Stripe from 'stripe';
import Order from '../models/orderModel.js';
import 'dotenv/config';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc Create stripe checkout session
// @route POST /api/payment/create-checkout-session
// @access Private
const createCheckoutSession = asyncHandler(async (req, res) => {
    const { orderId } = req.body;
    const order = await Order.findById(orderId).populate('items.product');
    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }
    const line_items = order.items.map(item => {
        return {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100, // price in cents
            },
            quantity: item.quantity,
        };
    });
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/order/${order._id}?success=true`,
        cancel_url: `${process.env.FRONTEND_URL}/order/${order._id}?canceled=true`,
        metadata: {
            orderId: orderId,
        }
    });
    res.json({ id: session.id });
});

// @desc Stripe webhook
// @route POST /api/payment/webhook
// @access Public
const stripeWebhook = asyncHandler(async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig,
            process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const orderId = session.metadata.orderId;
        const order = await Order.findById(orderId);
        if (order) {
            order.paymentDetails.paymentStatus = 'Paid';
            order.paymentDetails.paymentId = session.payment_intent;
            await order.save();
        }
    }
    res.status(200).json({ received: true });
});

export { createCheckoutSession, stripeWebhook };