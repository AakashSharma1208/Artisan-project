const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
        trim: true
    },
    media: {
        type: String, // URL for image or video
        default: ''
    },
    mediaType: {
        type: String, // 'image' or 'video'
        enum: ['image', 'video', 'none'],
        default: 'none'
    }
}, {
    timestamps: true
});

// One user can only review a product once
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
