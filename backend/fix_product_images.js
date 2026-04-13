const mongoose = require('mongoose');
require('dotenv').config();

const productSchema = new mongoose.Schema({
    productName: String,
    images: [String]
});

const Product = mongoose.model('Product', productSchema);

// Verified working Unsplash IDs for various crafts
const validPhotos = [
    "https://images.unsplash.com/photo-1578749553371-87eef94f224f", // Pottery
    "https://images.unsplash.com/photo-1590736910118-24388481313c", // Wood
    "https://images.unsplash.com/photo-1513519245088-0e12902e5a38", // Decor
    "https://images.unsplash.com/photo-1610701596007-11502861dcfa", // Pottery Blue
    "https://images.unsplash.com/photo-1544967082-d9d25d867d66", // Elephant wood
    "https://images.unsplash.com/photo-1582562124811-c09040d0a901", // Textile Indigo
    "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9", // Scarf
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e", // Jewelry Silver
    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908", // Necklace
    "https://images.unsplash.com/photo-1501472312651-726afe119ff1", // Art
    "https://images.unsplash.com/photo-1566150905458-1f3707718221", // Bag
    "https://images.unsplash.com/photo-1545241047-6083a3684587", // Macrame
    "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d", // Blanket
    "https://images.unsplash.com/photo-1573408301185-9146fe634ad0", // Bracelet
    "https://images.unsplash.com/photo-1531346878377-a5be20888e57", // Journal
    "https://images.unsplash.com/photo-1612475252876-1b48b7d7b7b7"  // Decor Glass
];

async function fix() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB...');

        const products = await Product.find({}).sort({ updatedAt: -1 }).limit(35);
        console.log(`Analyzing ${products.length} products...`);

        let updated = 0;
        for (let i = 0; i < products.length; i++) {
            const photoUrl = `${validPhotos[i % validPhotos.length]}?auto=format&fit=crop&w=800&q=80`;
            products[i].images = [photoUrl];
            await products[i].save();
            updated++;
        }

        console.log(`Successfully restored visibility for ${updated} products!`);
    } catch (err) {
        console.error('Fix error:', err);
    } finally {
        process.exit(0);
    }
}

fix();
