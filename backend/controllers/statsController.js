const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Product = require('../models/Product');

// @desc    Get dynamic statistics for About Us page
// @route   GET /api/stats
// @access  Public
exports.getStats = async (req, res) => {
    console.log('GET /api/public-stats hit');
    try {
        const totalVendors = await Vendor.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalCustomers = await User.countDocuments({ role: 'user' });
        
        // Get unique cities from both Users and Vendors
        const userCities = await User.distinct('address.city');
        const vendorCities = await Vendor.distinct('location');
        
        const allCities = new Set([...userCities, ...vendorCities].filter(Boolean));
        const totalCities = allCities.size;

        res.status(200).json({
            success: true,
            data: {
                totalVendors,
                totalProducts,
                totalCustomers,
                totalCities
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error while fetching statistics',
            error: error.message
        });
    }
};
