const mongoose = require('mongoose');
require('dotenv').config();

const productSchema = new mongoose.Schema({
    productName: String,
    description: String,
    price: Number,
    category: String,
    vendorId: mongoose.Schema.Types.ObjectId,
    images: [String],
    stock: Number
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

const vendorAakash = '69d87f2bb11d7272760f885a';
const vendorCreative = '69d87f2bb11d7272760f885e';

const products = [
    // Aakash Crafts - Heritage/Wood/Pottery
    {
        productName: "Royal Teal Ceramic Vase",
        description: "A stunning handmade teal ceramic vase with intricate gold-leaf detailing. Perfect for modern home decor with a touch of heritage.",
        price: 3499,
        category: "Pottery",
        vendorId: vendorAakash,
        images: ["https://images.unsplash.com/photo-1578749553371-87eef94f224f?auto=format&fit=crop&w=800&q=80"],
        stock: 12
    },
    {
        productName: "Hand-Carved Teak Elephant",
        description: "Masterfully carved from a single piece of premium teak wood. A symbol of strength and good luck for your living space.",
        price: 5200,
        category: "Wood Crafts",
        vendorId: vendorAakash,
        images: ["https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=800&q=80"],
        stock: 8
    },
    {
        productName: "Blue Pottery Dinner Set",
        description: "Traditional Jaipur blue pottery 12-piece dinner set. Lead-free, microwave safe, and exceptionally beautiful.",
        price: 8500,
        category: "Pottery",
        vendorId: vendorAakash,
        images: ["https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80"],
        stock: 5
    },
    {
        productName: "Sandalwood Incense Holder",
        description: "A fragrant sandalwood holder with intricate latticework designs. Releases a calming aroma even when not in use.",
        price: 1200,
        category: "Wood Crafts",
        vendorId: vendorAakash,
        images: ["https://images.unsplash.com/photo-1602853183816-1f307328901a?auto=format&fit=crop&w=800&q=80"],
        stock: 25
    },
    {
        productName: "Terracotta Mural Wall Art",
        description: "Large 2x2 feet terracotta mural depicting village life. Hand-molded and sun-baked for durability.",
        price: 4800,
        category: "Home Decor",
        vendorId: vendorAakash,
        images: ["https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=800&q=80"],
        stock: 4
    },
    {
        productName: "Rosewood Jewelry Chest",
        description: "Multi-layered rosewood box with brass inlay work and velvet lining. A family heirloom piece.",
        price: 6500,
        category: "Wood Crafts",
        vendorId: vendorAakash,
        images: ["https://images.unsplash.com/photo-1590736910118-24388481313c?auto=format&fit=crop&w=800&q=80"],
        stock: 7
    },
    {
        productName: "Traditional Warli Painting",
        description: "Hand-painted Warli art on handmade paper using natural dyes. Framed in elegant dark wood.",
        price: 2800,
        category: "Traditional Art",
        vendorId: vendorAakash,
        images: ["https://images.unsplash.com/photo-1501472312651-726afe119ff1?auto=format&fit=crop&w=800&q=80"],
        stock: 10
    },
    {
        productName: "Earthen Clay Tea Cups (Set of 6)",
        description: "Eco-friendly, reusable clay cups (Kulhads) for that authentic tea experience. Naturally cools and adds flavor.",
        price: 899,
        category: "Pottery",
        vendorId: vendorAakash,
        images: ["https://images.unsplash.com/photo-1515696423086-05947c341e4a?auto=format&fit=crop&w=800&q=80"],
        stock: 40
    },
    {
        productName: "Brass Ganesha Statue",
        description: "Solid brass idol of Lord Ganesha with antique finish. Perfect for your home altar or entrance.",
        price: 3200,
        category: "Home Decor",
        vendorId: vendorAakash,
        images: ["https://images.unsplash.com/photo-1567591974664-9f5e016ed203?auto=format&fit=crop&w=800&q=80"],
        stock: 15
    },
    {
        productName: "Bamboo Weave Fruit Basket",
        description: "Sustainable bamboo basket hand-woven by rural artisans. Durable, lightweight, and stylish.",
        price: 750,
        category: "Other",
        vendorId: vendorAakash,
        images: ["https://images.unsplash.com/photo-1596708143467-33924fe56f10?auto=format&fit=crop&w=800&q=80"],
        stock: 30
    },
    {
        productName: "Marble Inlay Coasters",
        description: "Set of 4 white marble coasters with semi-precious stone inlay work. Taj Mahal style craftsmanship.",
        price: 1800,
        category: "Home Decor",
        vendorId: vendorAakash,
        images: ["https://images.unsplash.com/photo-1616489953149-8051770217a2?auto=format&fit=crop&w=800&q=80"],
        stock: 20
    },
    {
        productName: "Hand-Painted Kathakali Mask",
        description: "Vibrant and detailed Kathakali dance mask wall hanging. Made from eco-friendly paper-pulp and wood.",
        price: 2200,
        category: "Traditional Art",
        vendorId: vendorAakash,
        images: ["https://images.unsplash.com/photo-1513511116-24388481313c?auto=format&fit=crop&w=800&q=80"],
        stock: 6
    },
    {
        productName: "Copper Hammered Jug",
        description: "99% pure copper jug with hand-hammered texture. Health benefit for storing water overnight.",
        price: 1599,
        category: "Other",
        vendorId: vendorAakash,
        images: ["https://images.unsplash.com/photo-1617191519105-027581707393?auto=format&fit=crop&w=800&q=80"],
        stock: 18
    },
    {
        productName: "Stone Carved Diya Lamp",
        description: "Traditional oil lamp carved from soapstone. Holds heat well and provides a soft, warm glow.",
        price: 450,
        category: "Other",
        vendorId: vendorAakash,
        images: ["https://images.unsplash.com/photo-1574633753331-57fc47113197?auto=format&fit=crop&w=800&q=80"],
        stock: 50
    },
    {
        productName: "Walnut Wood Phone Stand",
        description: "Sleek and minimalist phone stand made from dark walnut wood. Features a charging slot.",
        price: 999,
        category: "Wood Crafts",
        vendorId: vendorAakash,
        images: ["https://images.unsplash.com/photo-1533230114008-0129ae3e62f4?auto=format&fit=crop&w=800&q=80"],
        stock: 22
    },

    // Creative Hands Studio - Textiles/Jewelry
    {
        productName: "Pashmina Wool Scarf",
        description: "Ultra-soft, genuine Pashmina wool scarf from Kashmir. Features traditional paisley patterns.",
        price: 7500,
        category: "Handmade Clothing",
        vendorId: vendorCreative,
        images: ["https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=800&q=80"],
        stock: 10
    },
    {
        productName: "Hand-Beaded Boho Necklace",
        description: "Vibrant multi-colored beaded necklace with natural stone pendants. Perfect for adding a pop of color.",
        price: 1499,
        category: "Handmade Jewelry",
        vendorId: vendorCreative,
        images: ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80"],
        stock: 15
    },
    {
        productName: "Silk Embroidered Clutch",
        description: "Elegant silk evening clutch with Zardosi embroidery and metallic clasp. Fits all your essentials.",
        price: 2400,
        category: "Handmade Clothing",
        vendorId: vendorCreative,
        images: ["https://images.unsplash.com/photo-1566150905458-1f3707718221?auto=format&fit=crop&w=800&q=80"],
        stock: 12
    },
    {
        productName: "Block-Print Cotton Tunic",
        description: "Comfortable organic cotton tunic featuring hand-blocked Indigo floral patterns. Breathable and stylish.",
        price: 1850,
        category: "Handmade Clothing",
        vendorId: vendorCreative,
        images: ["https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=800&q=80"],
        stock: 20
    },
    {
        productName: "Macrame Hanging Planter",
        description: "Boho-style macrame wall hanging with a built-in pot holder. Made from 100% natural cotton cord.",
        price: 1200,
        category: "Home Decor",
        vendorId: vendorCreative,
        images: ["https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80"],
        stock: 25
    },
    {
        productName: "Sterling Silver Tribal Rings",
        description: "Set of 3 adjustable sterling silver rings with traditional tribal motifs. Oxidized finish.",
        price: 3200,
        category: "Handmade Jewelry",
        vendorId: vendorCreative,
        images: ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80"],
        stock: 8
    },
    {
        productName: "Felt Wool Nursery Mobile",
        description: "Whimsical nursery mobile featuring hand-felted animals and clouds. Safe and eco-friendly.",
        price: 1500,
        category: "Other",
        vendorId: vendorCreative,
        images: ["https://images.unsplash.com/photo-1610475252876-1b48b7d7b7b7?auto=format&fit=crop&w=800&q=80"],
        stock: 14
    },
    {
        productName: "Hand-Bound Leather Journal",
        description: "Vintage-style leather journal with handmade deckle-edge paper. Perfect for sketching or journaling.",
        price: 1999,
        category: "Other",
        vendorId: vendorCreative,
        images: ["https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=800&q=80"],
        stock: 30
    },
    {
        productName: "Braided Jute Handbag",
        description: "Eco-chic handbag made from braided jute and vegan leather handles. Ideal for everyday use.",
        price: 2100,
        category: "Handmade Clothing",
        vendorId: vendorCreative,
        images: ["https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=800&q=80"],
        stock: 18
    },
    {
        productName: "Crochet Throw Blanket",
        description: "Large, cozy throw blanket hand-crocheted in a classic waffle stitch. Machine washable.",
        price: 4500,
        category: "Home Decor",
        vendorId: vendorCreative,
        images: ["https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80"],
        stock: 5
    },
    {
        productName: "Ceramic Bead Bracelet",
        description: "Unique bracelet featuring hand-painted ceramic beads and a silk tassel. Elasticated for comfort.",
        price: 650,
        category: "Handmade Jewelry",
        vendorId: vendorCreative,
        images: ["https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80"],
        stock: 45
    },
    {
        productName: "Recycled Glass Candle Holder",
        description: "Colorful votive candle holders made from recycled stained glass. Creates a beautiful mosaic effect.",
        price: 850,
        category: "Home Decor",
        vendorId: vendorCreative,
        images: ["https://images.unsplash.com/photo-1614728263952-84ea206f94b6?auto=format&fit=crop&w=800&q=80"],
        stock: 22
    },
    {
        productName: "Tie-Dye Silk Scarf",
        description: "One-of-a-kind silk scarf hand-dyed using traditional Bandhani techniques.",
        price: 1600,
        category: "Handmade Clothing",
        vendorId: vendorCreative,
        images: ["https://images.unsplash.com/photo-1513511116-24388481313c?auto=format&fit=crop&w=800&q=80"],
        stock: 15
    },
    {
        productName: "Hand-Knotted Dreamcatcher",
        description: "Large dreamcatcher with intricate web and natural feathers. A peaceful addition to any bedroom.",
        price: 1100,
        category: "Home Decor",
        vendorId: vendorCreative,
        images: ["https://images.unsplash.com/photo-1536964542287-0256bc5cd08b?auto=format&fit=crop&w=800&q=80"],
        stock: 20
    },
    {
        productName: "Brass Inlay Wooden Mirror",
        description: "Circular wall mirror with a hand-carved mango wood frame and brass sunburst inlay.",
        price: 5800,
        category: "Home Decor",
        vendorId: vendorCreative,
        images: ["https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=80"],
        stock: 3
    }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB...');
        
        // Remove old products to keep database clean if you want, 
        // but user said "add MORE", so I will JUST ADD.
        
        const result = await Product.insertMany(products);
        console.log(`Successfully added ${result.length} products!`);
        
    } catch (err) {
        console.error('Seeding error:', err);
    } finally {
        process.exit(0);
    }
}

seed();
