import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      isRated: {
        type: Boolean,
        default: false,
      },
      // FIX: Add a field to store the rating the user gave
      rating: {
        type: Number,
      }
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