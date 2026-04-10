const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        enum: [
            'Handmade Jewelry', 
            'Pottery', 
            'Wood Crafts', 
            'Paintings', 
            'Handmade Clothing', 
            'Home Decor', 
            'Traditional Art',
            'Other'
        ]
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    images: [{
        type: String, // URLs
        required: true
    }],
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 1
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
