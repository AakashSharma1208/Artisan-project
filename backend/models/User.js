const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: false,
        default: null
    },
    role: {
        type: String,
        enum: ['user', 'vendor', 'admin'],
        default: 'user'
    },
    profileImage: {
        type: String,
        default: ''
    },
    address: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
