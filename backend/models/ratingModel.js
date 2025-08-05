import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        required: false,
        maxLength: 200,
    },
}, {
    timestamps: true,
});

// Ensure a user can only rate a product once
ratingSchema.index({ product: 1, user: 1 }, { unique: true });

const Rating = mongoose.model('Rating', ratingSchema);

export default Rating;