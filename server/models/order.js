import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
  },
  paymentMethod: {
    type: String,
    enum: ['UPI', 'DEBIT CARD', 'CASH ON DELIVERY'], // FIX: Corrected typo 'DEVLIVERY'
  },
  orderTime: {
    type: Date,
    default: Date.now,
  },
  note: {
    type: String,
  },
});

const Order = mongoose.model('Order', orderSchema);

export default Order;