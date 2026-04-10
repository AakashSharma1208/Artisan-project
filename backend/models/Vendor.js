const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    vendorName: {
        type: String,
        required: true,
        trim: true
    },
    ownerName: {
        type: String,
        required: true,
        trim: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    profileImage: {
        type: String,
        default: ''
    },
    bannerImage: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    isApproved: {
        type: Boolean,
        default: false // Admin must approve vendors
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Vendor', vendorSchema);
