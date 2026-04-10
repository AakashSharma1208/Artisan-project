const express = require('express');
const router = express.Router();
const { signup, login, getProfile, googleAuth, googleTokenAuth } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/google-token', googleTokenAuth);
router.get('/profile', protect, getProfile);

module.exports = router;
