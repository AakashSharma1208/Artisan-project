const mongoose = require('mongoose');
require('dotenv').config();

const Product = mongoose.model('Product', new mongoose.Schema({
    productName: String,
    images: [String]
}));

async function ultimateFix() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB...');

        const products = await Product.find({});
        console.log(`Updating ${products.length} products with reliable seeded images...`);

        let count = 0;
        for (const product of products) {
            // Using picsum.photos with the _id as seed for 100% uniqueness and reliability
            const newUrl = `https://picsum.photos/seed/${product._id}/800/600`;
            product.images = [newUrl];
            await product.save();
            count++;
        }

        console.log(`Successfully updated ${count} products with reliable, unique images!`);
    } catch (err) {
        console.error('Ultimate Fix Error:', err);
    } finally {
        process.exit(0);
    }
}

ultimateFix();
