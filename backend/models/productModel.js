import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['Coffee', 'Tea', 'Beverages', 'Snacks', 'Desserts', 'Bakery'],
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    imageUrl: {
        type: String,
        required: false, // Or true if an image is mandatory
    },
    averageRating: {
        type: Number,
        default: 0,
    },
    totalRatings: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

export default Product;
