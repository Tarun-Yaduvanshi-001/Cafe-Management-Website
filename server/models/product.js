import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'], // FIX: Corrected typo 'requied'
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
    enum: ['coffee', 'tea', 'food', 'dessert', 'pastries'], // Added pastries for consistency
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
  rating: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rating',
  }],
});

const Product = mongoose.model('Product', productSchema);

export default Product;