const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private/User
exports.addOrderItems = async (req, res) => {
    try {
        const { products, shippingAddress, totalAmount, paymentMethod } = req.body;

        if (!products || products.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        // Validate vendorId exists for every product
        const missingVendor = products.some(item => !item.vendorId);
        if (missingVendor) {
            return res.status(400).json({ message: 'Order validation failed: Missing vendorId for one or more products. Please try adding the items to your cart again.' });
        }

        console.log("Creating order for user:", req.user._id);
        console.log("Order items:", JSON.stringify(products));

        const order = new Order({
            userId: req.user._id,
            products: products.map(item => ({
                productId: item.productId,
                vendorId: item.vendorId,
                quantity: item.quantity,
                price: item.price
            })),
            shippingAddress: {
                street: shippingAddress.street || 'N/A',
                city: shippingAddress.city || 'N/A',
                state: shippingAddress.state || 'N/A',
                zip: shippingAddress.zip || 'N/A',
                country: shippingAddress.country || 'N/A'
            },
            totalPrice: totalAmount,
            paymentMethod: paymentMethod || 'COD',
            paymentStatus: req.body.paymentStatus || 'Pending'
        });

        const createdOrder = await order.save();
        console.log("Order created successfully:", createdOrder._id);
        res.status(201).json(createdOrder);
    } catch (error) {
        console.error("Order Creation Error:", error);
        res.status(500).json({ message: error.message || 'Server Error creating order' });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private/User
exports.getMyOrders = async (req, res) => {
    try {
        console.log("Fetching personal orders for user:", req.user.email);
        const orders = await Order.find({ userId: req.user._id }).populate('products.productId', 'productName images');
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error retrieving user orders' });
    }
};

// @desc    Get orders for a vendor
// @route   GET /api/orders/vendor
// @access  Private/Vendor
exports.getVendorOrders = async (req, res) => {
    try {
        const Vendor = require('../models/Vendor');
        console.log("Fetching vendor orders for user:", req.user.email);
        const vendorProfile = await Vendor.findOne({ user_id: req.user._id });

        if (!vendorProfile) {
            return res.status(404).json({ message: 'Vendor profile not found' });
        }

        const orders = await Order.find()
            .populate('userId', 'name email')
            .populate('products.productId', 'vendorId productName images')
            .lean();
        
        const vendorIdStr = vendorProfile._id.toString();
        
        const vendorSpecificOrders = orders.map(order => {
            // Filter products to belong only to this vendor
            const vendorProducts = order.products.filter(p => {
                const pVendorId = p.vendorId?.toString() || p.productId?.vendorId?.toString();
                return pVendorId === vendorIdStr;
            });
            
            if (vendorProducts.length === 0) return null; // Vendor has no items in this order
            
            // Recalculate total strictly for this vendor's share of the order
            const vendorTotal = vendorProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
            
            return {
                ...order,
                products: vendorProducts,
                totalPrice: vendorTotal
            };
        }).filter(Boolean); // Remove nulls

        // Sort by newest first
        vendorSpecificOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json(vendorSpecificOrders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error retrieving vendor orders' });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Vendor or Admin
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus } = req.body;
        const order = await Order.findById(req.params.id);

        if (order) {
            order.orderStatus = orderStatus;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error updating order status' });
    }
};
