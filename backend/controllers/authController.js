const User = require('../models/User');
const Vendor = require('../models/Vendor');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: '30d'
    });
};

exports.generateToken = generateToken;

// @desc    Register a new user
// @route   POST /api/auth/signup
exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const assignedRole = (role === 'vendor' || role === 'admin') ? role : 'user';

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: assignedRole
        });

        // If user is a vendor, we should create a skeletal vendor profile
        // but for a true vendor registration, they might need extra fields.
        // For simplicity, we create a default Vendor record if they choose 'vendor'
        if (user.role === 'vendor') {
            await Vendor.create({
                user_id: user._id,
                vendorName: name + "'s Shop",
                ownerName: name,
                email: email,
                phone: req.body.phone || '000-000-0000',
                description: 'A new handmade shop.',
                location: 'Earth'
            });
        }

        res.status(201).json({
            token: generateToken(user._id, user.role),
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during signup' });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                token: generateToken(user._id, user.role),
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

// @desc    Get user profile (protected)
// @route   GET /api/auth/profile
exports.getProfile = async (req, res) => {
    try {
        console.log("Serving profile for user:", req.user.email);
        // req.user is already populated by protect middleware
        if (req.user) {
            res.json(req.user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("Error serving profile:", error.message);
        res.status(500).json({ message: 'Server error retrieving profile' });
    }
};
// @desc    Google Token Auth (access token flow)
// @route   POST /api/auth/google-token
exports.googleTokenAuth = async (req, res) => {
    try {
        const { name, email, picture } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required from Google.' });

        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                name: name || 'Google User',
                email,
                password: null,
                role: 'user',
                profileImage: picture || '',
            });
        } else if (picture && !user.profileImage) {
            user.profileImage = picture;
            await user.save();
        }

        res.json({
            token: generateToken(user._id, user.role),
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileImage: user.profileImage,
            },
        });
    } catch (error) {
        console.error('Google Token Auth Error:', error.message);
        res.status(500).json({ message: 'Server error during Google sign-in.' });
    }
};

exports.googleAuth = async (req, res) => {
    try {
        const { credential } = req.body;
        if (!credential) {
            return res.status(400).json({ message: 'No Google credential provided.' });
        }

        const clientId = process.env.GOOGLE_CLIENT_ID;
        const client = new OAuth2Client(clientId);

        // Verify the Google token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: clientId,
        });
        const payload = ticket.getPayload();
        const { name, email, picture, sub: googleId } = payload;

        // Find or create user
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                name,
                email,
                password: null,
                role: 'user',
                profileImage: picture || '',
            });
        } else {
            // Update profile picture if it changed
            if (picture && !user.profileImage) {
                user.profileImage = picture;
                await user.save();
            }
        }

        res.json({
            token: generateToken(user._id, user.role),
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileImage: user.profileImage,
            },
        });
    } catch (error) {
        console.error('Google Auth Error:', error.message);
        res.status(401).json({ message: 'Google sign-in failed. Please try again.' });
    }
};

// @desc    Redirect to Google OAuth consent screen
// @route   GET /auth/google
exports.googleOAuthRedirect = (req, res) => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const redirectUri = `${backendUrl}/auth/google/callback`;

    const oAuth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);
    
    const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ],
        prompt: 'consent' // Forces consent UI to display if needed
    });
    
    res.redirect(authorizeUrl);
};

// @desc    Handle Google OAuth callback and token exchange
// @route   GET /auth/google/callback
exports.googleOAuthCallback = async (req, res) => {
    const { code, error } = req.query;
    const frontendUrl = process.env.CLIENT_URL || 'http://localhost:5173'; // Vite default port

    if (error) {
        console.error('Google Auth Error:', error);
        return res.redirect(`${frontendUrl}?error=GoogleLoginFailed`);
    }

    try {
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
        const redirectUri = `${backendUrl}/auth/google/callback`;

        const oAuth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);

        // Exchange code for target tokens
        const { tokens } = await oAuth2Client.getToken(code);
        
        // Use standard google userinfo endpoint
        const axios = require('axios'); // We can use fetch or axios, axios is standard here
        const userInfoRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${tokens.access_token}` }
        });
        
        const { name, email, picture } = userInfoRes.data;

        // Check if user exists or create new
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                name: name || 'Google User',
                email,
                password: null,
                role: 'user',
                profileImage: picture || '',
            });
        } else if (picture && !user.profileImage) {
            user.profileImage = picture;
            await user.save();
        }

        // Generate our JWT token for local session
        const token = generateToken(user._id, user.role);

        // Redirect back strictly to 5174 per the user spec
        res.redirect(`${frontendUrl}?token=${token}`);
        
    } catch (err) {
        console.error('Callback Exchange Error:', err.message);
        // Explicitly send error string so user doesn't just see a silent redirect
        res.status(500).send(`OAuth Backend Error: ${err.message}. If it says 'missing client_secret', add GOOGLE_CLIENT_SECRET to your backend .env file!`);
    }
};
