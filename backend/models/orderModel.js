import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }, // Price per item at time of order
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
});
const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [orderItemSchema],
    totalAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'],
        default: 'Pending',
    },
    paymentDetails: {
        paymentId: { type: String },
        paymentStatus: {
            type: String,
            enum: ['Pending', 'Paid', 'Failed'],
            default: 'Pending',
        },
    },
    shippingAddress: { // Optional, if delivery is a feature
        address: { type: String },
        city: { type: String },
        postalCode: { type: String },
    },
}, {
    timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);

export default Order;