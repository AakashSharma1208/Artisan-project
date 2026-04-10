const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Load models
const User = require('./models/User');
const Vendor = require('./models/Vendor');
const Product = require('./models/Product');

// Connect to DB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/artisan')
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch(err => {
        console.error('Error connecting to DB:', err);
        process.exit(1);
    });

const seedData = async () => {
    try {
        // 1. Clear existing data
        await Product.deleteMany();
        await Vendor.deleteMany();
        await User.deleteMany({ role: 'vendor' }); // Clear only vendor users to keep admin/shoppers
        console.log('Cleared existing product and vendor data.');

        // 2. Create Dummy Vendors
        const vendorUsers = [
            { name: 'Raj Kumar', email: 'raj@rajasthan.com', vendorName: 'Rajasthan Crafts', location: 'Jaipur, India', desc: 'Authentic block prints and jewelry.' },
            { name: 'Elena Rossi', email: 'elena@ceramics.com', vendorName: 'Rossi Ceramics', location: 'Florence, Italy', desc: 'Handcrafted stoneware and pottery.' },
            { name: 'Kenji Sato', email: 'kenji@woodworks.com', vendorName: 'Sato Woodworks', location: 'Kyoto, Japan', desc: 'Minimalist wooden furniture and decor.' },
        ];

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('password123', salt);

        const createdVendors = [];

        for (const v of vendorUsers) {
            const user = await User.create({
                name: v.name,
                email: v.email,
                password: passwordHash,
                role: 'vendor'
            });

            const vendor = await Vendor.create({
                vendorName: v.vendorName,
                ownerName: v.name,
                user_id: user._id,
                email: v.email,
                phone: '+1 234 567 8900',
                description: v.desc,
                location: v.location,
                isApproved: true
            });

            createdVendors.push(vendor);
        }
        console.log('Created dummy vendors.');

        const getRandomVendorId = () => {
            const randomIndex = Math.floor(Math.random() * createdVendors.length);
            return createdVendors[randomIndex]._id;
        };

        // 3. Create Products
        const sampleProducts = [
            {
                productName: "Handmade Silver Necklace",
                description: "Elegant handcrafted silver necklace made by local artisans using traditional techniques.",
                price: 45,
                category: "Handmade Jewelry",
                images: ["https://images.unsplash.com/photo-1599643478514-4a820cbf311c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
                stock: 15,
                vendorId: createdVendors[0]._id // Rajasthan Crafts
            },
            {
                productName: "Boho Beaded Choker",
                description: "Gorgeous bohemian choker with colorful hand-painted glass beads.",
                price: 25,
                category: "Handmade Jewelry",
                images: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
                stock: 20,
                vendorId: getRandomVendorId()
            },
            {
                productName: "Turquoise Drop Earrings",
                description: "Stunning turquoise drop earrings set in sterling silver. Perfect for any occasion.",
                price: 35,
                category: "Handmade Jewelry",
                images: ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
                stock: 8,
                vendorId: getRandomVendorId()
            },
            {
                productName: "Rustic Ceramic Mug",
                description: "A beautiful, earthy coffee mug thrown on a pottery wheel and glazed by hand.",
                price: 22,
                category: "Pottery",
                images: ["https://images.unsplash.com/photo-1610701596007-11502861dcfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
                stock: 30,
                vendorId: createdVendors[1]._id // Rossi Ceramics
            },
            {
                productName: "Speckled Decorative Bowl",
                description: "Large hand-built ceramic bowl with a unique speckled glaze. Food safe.",
                price: 45,
                category: "Pottery",
                images: ["https://images.unsplash.com/photo-1613143427771-b0db40249fcd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
                stock: 5,
                vendorId: getRandomVendorId()
            },
            {
                productName: "Artisan Terracotta Vase",
                description: "Tall terracotta vase, perfect for dried flowers or as a standalone piece.",
                price: 60,
                category: "Pottery",
                images: ["https://images.unsplash.com/photo-1578500494198-246f612d3b3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
                stock: 12,
                vendorId: getRandomVendorId()
            },
            {
                productName: "Walnut Cutting Board",
                description: "End-grain walnut cutting board, finished with food-safe mineral oil.",
                price: 85,
                category: "Wood Crafts",
                images: ["https://images.unsplash.com/photo-1584985223019-2169a8b169db?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
                stock: 10,
                vendorId: createdVendors[2]._id // Sato Woodworks
            },
            {
                productName: "Carved Wooden Spoons",
                description: "Set of three hand-carved cherry wood spoons for cooking and serving.",
                price: 30,
                category: "Wood Crafts",
                images: ["https://images.unsplash.com/photo-1590483736622-398541ce1a64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
                stock: 25,
                vendorId: getRandomVendorId()
            },
            {
                productName: "Abstract Ocean Painting",
                description: "Original acrylic on canvas abstract representation of ocean waves. 16x20 inches.",
                price: 150,
                category: "Paintings",
                images: ["https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
                stock: 1,
                vendorId: getRandomVendorId()
            },
            {
                productName: "Mountain Landscape Watercolor",
                description: "Original watercolor painting of a serene mountain landscape.",
                price: 80,
                category: "Paintings",
                images: ["https://images.unsplash.com/photo-1580136608260-4ebf15facb45?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
                stock: 1,
                vendorId: getRandomVendorId()
            },
            {
                productName: "Botanical Oil Painting",
                description: "Rich oil painting of wildflowers. Canvas stretched on wood frame.",
                price: 120,
                category: "Paintings",
                images: ["https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
                stock: 1,
                vendorId: getRandomVendorId()
            },
            {
                productName: "Hand-Dyed Linen Scarf",
                description: "Soft, breathable linen scarf naturally dyed with indigo plant extracts.",
                price: 40,
                category: "Handmade Clothing",
                images: ["https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
                stock: 15,
                vendorId: getRandomVendorId()
            },
            {
                productName: "Knit Oversized Sweater",
                description: "Chunky knit sweater made from 100% organic merino wool.",
                price: 110,
                category: "Handmade Clothing",
                images: ["https://images.unsplash.com/photo-1622510214690-34863a17e06a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
                stock: 6,
                vendorId: getRandomVendorId()
            },
            {
                productName: "Macrame Wall Hanging",
                description: "Large bohemian macrame wall hanging made with natural cotton cord.",
                price: 75,
                category: "Home Decor",
                images: ["https://images.unsplash.com/photo-1616486162386-35e9821d3fca?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
                stock: 8,
                vendorId: getRandomVendorId()
            },
            {
                productName: "Hand-poured Soy Candle",
                description: "Lavender and eucalyptus scented soy candle in a reusable amber glass jar.",
                price: 24,
                category: "Home Decor",
                images: ["https://images.unsplash.com/photo-1603006905003-be475563bc59?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
                stock: 50,
                vendorId: getRandomVendorId()
            },
            {
                productName: "African Woven Basket",
                description: "Traditional sweetgrass woven basket, perfect for storage or display.",
                price: 65,
                category: "Home Decor",
                images: ["https://images.unsplash.com/photo-1596769910398-4c28cc887413?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
                stock: 10,
                vendorId: getRandomVendorId()
            },
            {
                productName: "Hand-Painted Paper Lantern",
                description: "Traditional bamboo and paper lantern with cherry blossom motif.",
                price: 35,
                category: "Traditional Art",
                images: ["https://images.unsplash.com/photo-1582216508933-289b88cf2fc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
                stock: 20,
                vendorId: getRandomVendorId()
            },
            {
                productName: "Mosaic Tile Coasters",
                description: "Set of 4 traditional mosaic tile coasters. Heat and water resistant.",
                price: 28,
                category: "Traditional Art",
                images: ["https://images.unsplash.com/photo-1563200922-86ee6e568ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
                stock: 15,
                vendorId: getRandomVendorId()
            }
        ];

        await Product.insertMany(sampleProducts);
        console.log(`Successfully added ${sampleProducts.length} sample products!`);
        
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
