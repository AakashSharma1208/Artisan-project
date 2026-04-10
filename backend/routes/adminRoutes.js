const express = require('express');
const router = express.Router();
const {
    getPlatformStats,
    getAllUsers,
    promoteToVendor,
    deleteUser,
    getAllVendors,
    approveVendor,
    getAllProducts,
    adminAddProduct,
    adminDeleteProduct,
    getAllOrders,
    adminUpdateOrderStatus
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes are protected and require 'admin' role
router.use(protect);
router.use(authorize('admin'));

// Stats
router.get('/stats', getPlatformStats);

// User Management
router.get('/users', getAllUsers);
router.put('/users/:id/promote', promoteToVendor);
router.delete('/users/:id', deleteUser);

// Vendor Management
router.get('/vendors', getAllVendors);
router.put('/vendors/:id/approve', approveVendor);

// Product Management
router.get('/products', getAllProducts);
router.post('/products', adminAddProduct);
router.delete('/products/:id', adminDeleteProduct);

// Order Management
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', adminUpdateOrderStatus);

module.exports = router;
