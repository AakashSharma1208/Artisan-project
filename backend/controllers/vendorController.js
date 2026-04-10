const Vendor = require('../models/Vendor');
const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Register current user as a vendor
// @route   POST /api/vendors/register
// @access  Private (any logged-in user)
exports.registerAsVendor = async (req, res) => {
    try {
        const { vendorName, description, location, phone, address, profileImage, bannerImage } = req.body;

        // Check if already a vendor
        const existing = await Vendor.findOne({ user_id: req.user._id });
        if (existing) {
            return res.status(400).json({ message: 'You already have a vendor profile.' });
        }

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found.' });

        // Create vendor profile
        const vendor = await Vendor.create({
            user_id: user._id,
            vendorName,
            ownerName: user.name,
            email: user.email,
            phone: phone || '000-000-0000',
            description: description || 'Handcrafted goods.',
            location: location || 'Earth',
            address: address || '',
            profileImage: profileImage || '',
            bannerImage: bannerImage || '',
            isApproved: true // auto-approve for now
        });

        // Upgrade user role
        user.role = 'vendor';
        await user.save();

        const { generateToken } = require('./authController');

        res.status(201).json({
            message: 'Vendor profile created successfully!',
            token: generateToken(user._id, user.role),
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            vendor,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error registering vendor.' });
    }
};

// @desc    Get vendor profile
// @route   GET /api/vendors/profile
// @access  Private/Vendor
exports.getVendorProfile = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        console.log("User ID:", userId);
        
        let vendor = await Vendor.findOne({ user_id: userId });
        
        // Auto-create if not found (Step 7)
        if (!vendor) {
            console.log("Vendor profile not found, auto-creating for user:", req.user.email);
            vendor = await Vendor.create({
                user_id: userId,
                vendorName: req.user.name + "'s Studio",
                ownerName: req.user.name,
                email: req.user.email,
                phone: '000-000-0000',
                description: 'Welcome to my artisan studio.',
                location: 'India',
                isApproved: true
            });
        }

        console.log("Vendor:", vendor);
        res.json(vendor);
    } catch (error) {
        console.error("Profile Error:", error.message);
        res.status(500).json({ message: 'Server Error: Failed to retrieve or create vendor profile' });
    }
};

// @desc    Update vendor profile
// @route   PUT /api/vendors/profile
// @access  Private/Vendor
exports.updateVendorProfile = async (req, res) => {
    try {
        console.log("Updating vendor profile for user:", req.user.email);
        const vendor = await Vendor.findOne({ user_id: req.user._id });
        if (vendor) {
            // Indian Phone Validation: Starts with +91 and 10 digits OR just 10 digits
            const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
            if (req.body.phone && !phoneRegex.test(req.body.phone)) {
                return res.status(400).json({ message: 'Invalid Indian phone number. Please use +91 or 10 digits.' });
            }

            vendor.vendorName = req.body.shopName || req.body.vendorName || vendor.vendorName;
            vendor.ownerName = req.body.ownerName || vendor.ownerName;
            vendor.phone = req.body.contact || req.body.phone || vendor.phone;
            vendor.description = req.body.description || vendor.description;
            vendor.location = req.body.location || vendor.location;
            vendor.address = req.body.address || vendor.address;
            vendor.profileImage = req.body.profileImage !== undefined ? req.body.profileImage : vendor.profileImage;
            vendor.bannerImage = req.body.bannerImage !== undefined ? req.body.bannerImage : vendor.bannerImage;

            const updatedVendor = await vendor.save();
            console.log("Vendor profile updated:", updatedVendor.vendorName);
            res.json(updatedVendor);
        } else {
            console.warn("Vendor profile not found for update, user_id:", req.user._id);
            res.status(404).json({ message: 'Vendor profile not found' });
        }
    } catch (error) {
        console.error("Error updating vendor profile:", error.message);
        res.status(500).json({ message: 'Server Error: Failed to update vendor profile' });
    }
};

// @desc    Get all vendors
// @route   GET /api/vendors
// @access  Public
exports.getVendors = async (req, res) => {
    try {
        const filter = req.user && req.user.role === 'admin' ? {} : { isApproved: true };
        const vendors = await Vendor.find(filter).select('-user_id');
        res.json(vendors);
    } catch (error) {
        console.error("Error retrieving vendors:", error.message);
        res.status(500).json({ message: 'Server Error: Failed to retrieve vendors' });
    }
};

// @desc    Get vendor by ID & their products
// @route   GET /api/vendors/:id
// @access  Public
exports.getVendorById = async (req, res) => {
    try {
        const mongoose = require('mongoose');
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid Vendor ID format' });
        }

        console.log("Fetching vendor details for ID:", req.params.id);
        const vendor = await Vendor.findById(req.params.id).select('-user_id');
        
        if (vendor) {
            const products = await Product.find({ vendorId: vendor._id });
            console.log(`Vendor ${vendor.vendorName} found with ${products.length} products`);
            res.json({ vendor, products });
        } else {
            console.warn("Vendor not found with ID:", req.params.id);
            res.status(404).json({ message: 'Vendor not found' });
        }
    } catch (error) {
        console.error("Error retrieving vendor details:", error.message);
        res.status(500).json({ message: 'Server Error: Failed into retrieve vendor details' });
    }
};
