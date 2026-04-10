const mongoose = require('mongoose');
const User = require('./models/User');
const Vendor = require('./models/Vendor');
const Product = require('./models/Product');
const Order = require('./models/Order');

const DB_URI = 'mongodb://127.0.0.1:27017/artisan';

const seedData = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log('Connected to Database. Starting Seeding...');

        // Clear existing Seed data
        console.log('Clearing existing products and vendors...');
        await Product.deleteMany({});
        await Vendor.deleteMany({});
        await Order.deleteMany({}); // clearing orders to prevent broken references

        // Clean user accounts for these two specific emails to avoid duplicates
        await User.deleteMany({ email: { $in: ['aakash@aakashcrafts.com', 'creative@creativehands.com'] } });
        
        // 1. Create Vendors
        console.log('Creating Vendors...');
        
        // Vendor 1: Aakash Crafts
        const user1 = new User({
            name: 'Aakash Sharma',
            email: 'aakash@aakashcrafts.com',
            password: 'password123', // Demo setup
            role: 'vendor',
            profileImage: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&q=80',
        });
        await user1.save();

        const vendor1 = new Vendor({
            vendorName: 'Aakash Crafts',
            ownerName: 'Aakash Sharma',
            user_id: user1._id,
            email: 'aakash@aakashcrafts.com',
            phone: '+91 9876543210',
            profileImage: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&q=80',
            bannerImage: 'https://images.unsplash.com/photo-1605330310238-0fc65c898c69?auto=format&fit=crop&q=80',
            address: '123 Heritage Row, Jaipur',
            description: 'Handmade traditional and cultural products from the heart of India. We specialize in heritage-based art, wood crafts, and authentic pottery.',
            location: 'Jaipur, Rajasthan',
            isApproved: true
        });
        await vendor1.save();

        // Vendor 2: Creative Hands Studio
        const user2 = new User({
            name: 'Creative Hands',
            email: 'creative@creativehands.com',
            password: 'password123', // Demo setup
            role: 'vendor',
            profileImage: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80',
        });
        await user2.save();

        const vendor2 = new Vendor({
            vendorName: 'Creative Hands Studio',
            ownerName: 'Creative Designer',
            user_id: user2._id,
            email: 'creative@creativehands.com',
            phone: '+91 9876543211',
            profileImage: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80',
            bannerImage: 'https://images.unsplash.com/photo-1613437295282-5ee66b447af5?auto=format&fit=crop&q=80',
            address: '45 Modern St, Mumbai',
            description: 'Modern and aesthetic handmade products tailored for contemporary lifestyles. We focus on minimalism and elegant home decor.',
            location: 'Mumbai, Maharashtra',
            isApproved: true
        });
        await vendor2.save();


        // 2. Insert Products
        console.log('Creating Products...');
        
        const products = [
            // Aakash Crafts Products
            {
                productName: 'Hand-Painted Madhubani Canvas',
                description: 'An authentic Madhubani painting depicting traditional village life, hand-painted by master artisans using organic colors.',
                price: 2500,
                category: 'Paintings',
                vendorId: vendor1._id,
                images: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80'],
                stock: 12
            },
            {
                productName: 'Wooden Carved Wall Hanging',
                description: 'Intricately carved Teak wood wall hanging representing Indian flora. Perfect for adding a rustic touch to your home.',
                price: 1800,
                category: 'Wood Crafts',
                vendorId: vendor1._id,
                images: ['https://images.unsplash.com/photo-1611003228941-98852ba62227?auto=format&fit=crop&q=80'],
                stock: 8
            },
            {
                productName: 'Traditional Clay Diya Set',
                description: 'Set of 12 handcrafted terracotta diyas. Hand-painted with auspicious symbols, perfect for festivals and poojas.',
                price: 450,
                category: 'Pottery',
                vendorId: vendor1._id,
                images: ['https://images.unsplash.com/photo-1605330310238-0fc65c898c69?auto=format&fit=crop&q=80'],
                stock: 50
            },
            {
                productName: 'Handwoven Cotton Dupatta',
                description: 'Pure cotton dupatta featuring traditional block prints. Breathable, vibrant, and soft against the skin.',
                price: 950,
                category: 'Handmade Clothing',
                vendorId: vendor1._id,
                images: ['https://images.unsplash.com/photo-1604085572504-a392ddf0d86a?auto=format&fit=crop&q=80'],
                stock: 25
            },
            {
                productName: 'Brass Decorative Elephant Idol',
                description: 'A heavy brass cast elephant idol showcasing royal procession details. Ideal for living room centerpieces.',
                price: 3200,
                category: 'Traditional Art',
                vendorId: vendor1._id,
                images: ['https://images.unsplash.com/photo-1596766442657-36e6b8aadd0b?auto=format&fit=crop&q=80'],
                stock: 5
            },

            // Creative Hands Studio Products
            {
                productName: 'Minimalist Ceramic Vase',
                description: 'A sleek, white matte finish ceramic vase offering a touch of minimalism. Perfect for dried pampas grass or single stems.',
                price: 1200,
                category: 'Pottery',
                vendorId: vendor2._id,
                images: ['https://images.unsplash.com/photo-1613437295282-5ee66b447af5?auto=format&fit=crop&q=80'],
                stock: 15
            },
            {
                productName: 'Abstract Wall Art Frame',
                description: 'Contemporary abstract printed canvas in a sleek black handmade wooden frame, setting a modern aesthetic vibe.',
                price: 2100,
                category: 'Paintings',
                vendorId: vendor2._id,
                images: ['https://images.unsplash.com/photo-1549887552-cb1071d3e5ca?auto=format&fit=crop&q=80'],
                stock: 10
            },
            {
                productName: 'Aesthetic LED Lamp Decor',
                description: 'Handcrafted wooden base lamp paired with a warm, dimmable LED. Provides a cozy atmosphere for any reading corner.',
                price: 1650,
                category: 'Home Decor',
                vendorId: vendor2._id,
                images: ['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80'],
                stock: 20
            },
            {
                productName: 'Handmade Resin Jewelry Set',
                description: 'Elegant pendant and earring set made from crystal clear resin embedded with real pressed ferns.',
                price: 850,
                category: 'Handmade Jewelry',
                vendorId: vendor2._id,
                images: ['https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80'],
                stock: 30
            },
            {
                productName: 'Modern Macrame Wall Hanging',
                description: 'Boho-chic macrame woven from sustainable natural cotton cord. A gorgeous aesthetic addition to living spaces.',
                price: 1450,
                category: 'Home Decor',
                vendorId: vendor2._id,
                images: ['https://images.unsplash.com/photo-1522758971460-1d21fac222d1?auto=format&fit=crop&q=80'],
                stock: 12
            }
        ];

        await Product.insertMany(products);

        console.log('Seeding completed successfully!');
        
        const count = await Product.countDocuments();
        console.log(`Total Products in DB: ${count}`);
        
        process.exit(0);
    } catch (err) {
        console.error('Seeding Error:', err);
        process.exit(1);
    }
};

seedData();
