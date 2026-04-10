const mongoose = require('mongoose');
const Product = require('./models/Product');

const DB_URI = 'mongodb://127.0.0.1:27017/artisan';

const updateImages = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log('Connected to Database. Updating images...');

        const updates = [
            {
                name: 'Traditional Clay Diya Set',
                newImage: 'https://images.unsplash.com/photo-1605809312151-512c019d6728?auto=format&fit=crop&w=800&q=80' // Pottery/Diyas
            },
            {
                name: 'Brass Decorative Elephant Idol',
                newImage: 'https://images.unsplash.com/photo-1574883446522-303102c91ba4?auto=format&fit=crop&w=800&q=80' // Elephant/Art
            },
            {
                name: 'Minimalist Ceramic Vase',
                newImage: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=800&q=80' // Vase
            },
            {
                name: 'Abstract Wall Art Frame',
                newImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80' // Abstract Art
            }
        ];

        for (const update of updates) {
            const result = await Product.updateOne(
                { productName: update.name },
                { $set: { images: [update.newImage] } }
            );
            console.log(`Updated ${update.name}: ${result.modifiedCount > 0 ? 'Success' : 'Not found or unchanged'}`);
        }

        console.log('Images updated successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error updating images:', err);
        process.exit(1);
    }
};

updateImages();
