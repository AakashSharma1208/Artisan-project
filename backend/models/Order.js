const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [orderItemSchema],
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    orderStatus: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String
    },
    paymentMethod: {
        type: String,
        enum: ['COD', 'ONLINE'],
        required: true,
        default: 'COD'
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed'],
        required: true,
        default: 'Pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
