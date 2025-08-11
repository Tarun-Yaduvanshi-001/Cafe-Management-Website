import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      // FIX: Rename 'product' to 'productId' to match the rest of your app
      productId: {
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
  status: {
    type: String,
    enum: ['Pending', 'Preparing', 'Ready', 'Completed', 'Failed'],
    default: 'Pending',
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
  },
  paymentMethod: {
    type: String,
    enum: ['UPI', 'DEBIT CARD', 'CASH ON DELIVERY'],
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