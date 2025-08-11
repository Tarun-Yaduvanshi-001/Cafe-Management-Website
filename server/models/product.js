import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    maxLength: [500, 'Description cannot exceed 500 characters'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['coffee', 'tea', 'food', 'dessert', 'pastry'],
  },
  price: {
    type: Number,
    required: true,
  },
  sizes: [
    {
      name: {
        type: String,
        enum: ['small', 'medium', 'large', 'extra-large'],
      },
      price: {
        type: Number,
        min: 0,
      },
    },
  ],
  image: {
    type: String,
    default: null,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  rating : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : 'Rating'
  }],
  // FIX: Add the missing createdBy field
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, {
    timestamps: true // Adds createdAt and updatedAt fields automatically
});

const Product = mongoose.model('Product', productSchema);

export default Product;