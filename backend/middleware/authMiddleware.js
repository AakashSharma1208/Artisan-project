const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
            
            console.log("Decoded user from token:", decoded);

            // Fetch user from DB to ensure they still exist and have correct role
            const user = await User.findById(decoded.id).select('-password');
            
            if (!user) {
                return res.status(401).json({ message: 'User not found, invalid token' });
            }

            console.log("Fetched user from DB:", user.email, "Role:", user.role);

            req.user = user;
            return next();
        } catch (error) {
            console.error("JWT Verification Error:", error.message);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            console.log(`Authorization failed. User role: ${req.user ? req.user.role : 'None'}, required: ${roles}`);
            return res.status(403).json({ message: `User role ${req.user ? req.user.role : 'User'} is not authorized to access this route` });
        }
        next();
    };
};

module.exports = { protect, authorize };
