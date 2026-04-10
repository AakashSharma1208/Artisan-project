const express = require('express');
const router = express.Router();
const {
    registerAsVendor,
    getVendorProfile,
    updateVendorProfile,
    getVendors,
    getVendorById
} = require('../controllers/vendorController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Protected vendor-only routes (Specific routes first)
router.get('/me', protect, authorize('vendor'), getVendorProfile);
router.put('/update', protect, authorize('vendor'), updateVendorProfile);

router.route('/profile')
    .get(protect, authorize('vendor'), getVendorProfile)
    .put(protect, authorize('vendor'), updateVendorProfile);

// Register as vendor (any logged-in user)
router.post('/register', protect, registerAsVendor);

// Public routes (General routes last)
router.get('/', getVendors);
router.get('/:id', getVendorById);

module.exports = router;
