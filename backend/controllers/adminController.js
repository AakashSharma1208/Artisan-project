const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get platform statistics
exports.getPlatformStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalVendors = await Vendor.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();

        res.json({ totalUsers, totalVendors, totalProducts, totalOrders });
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching stats' });
    }
};

// --- USER MANAGEMENT ---
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
};

exports.promoteToVendor = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.role = 'vendor';
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error promoting user' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
    }
};

// --- VENDOR MANAGEMENT ---
exports.getAllVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find({}).sort({ createdAt: -1 });
        res.json(vendors);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching vendors' });
    }
};

exports.approveVendor = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id);
        if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
        vendor.isApproved = req.body.isApproved;
        await vendor.save();
        res.json(vendor);
    } catch (error) {
        res.status(500).json({ message: 'Error updating vendor status' });
    }
};

// --- PRODUCT MANAGEMENT ---
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({}).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products' });
    }
};

exports.adminAddProduct = async (req, res) => {
    try {
        const { vendorEmail, name, price, description, category, images } = req.body;
        const owner = await User.findOne({ email: vendorEmail });
        if (!owner) return res.status(404).json({ message: 'User not found with this email' });
        
        const vendorDoc = await Vendor.findOne({ user_id: owner._id }); // Fixed field name
        if (!vendorDoc) return res.status(404).json({ message: 'This user is not a vendor' });

        const product = new Product({
            name, price, description, category, images,
            vendor: vendorDoc._id
        });
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding product' });
    }
};

exports.adminDeleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product' });
    }
};

// --- ORDER MANAGEMENT ---
exports.getAllOrders = async (req, res) => {
    try {
        // Populating the user info from userId field
        const orders = await Order.find({}).populate('userId', 'name email').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
};

exports.adminUpdateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        
        // Model field is orderStatus
        order.orderStatus = req.body.status;
        await order.save();
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating order status' });
    }
};
