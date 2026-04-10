const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Basic Route for testing
app.get('/', (req, res) => {
    res.send('Artisan API is running...');
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const aiRoutes = require('./routes/aiRoutes');
const contactRoutes = require('./routes/contactRoutes');

const { googleOAuthRedirect, googleOAuthCallback } = require('./controllers/authController');

// Root level Google OAuth routes exactly as requested
app.get('/auth/google', googleOAuthRedirect);
app.get('/auth/google/callback', googleOAuthCallback);

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/contact', contactRoutes);

// Define PORT
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Force nodemon reboot trigger 2
