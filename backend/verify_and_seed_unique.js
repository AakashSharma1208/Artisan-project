const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

const Product = mongoose.model('Product', new mongoose.Schema({
    productName: String,
    images: [String]
}));

// 35 uniquely chosen, craft-related Unsplash Photo IDs
const craftPhotoIds = [
    // Pottery
    "1590736910118-24388481313c", "1578749553371-87eef94f224f", "1612196808214-b9e1d614e38a", "1610701596007-11502861dcfa",
    "1526406915894-3bcd65fca0b5", "1595166166579-9957262f275e", "1515696423086-05947c341e4a",
    // Wood
    "1544967082-d9d25d867d66", "1602853183816-1f307328901a", "1533230114008-0129ae3e62f4", "1618220179428-22790b461013",
    "1594223274512-ad4803739b7c", "1531346878377-a5be20888e57", "1574633753331-57fc47113197",
    // Decor
    "1581783898377-1c85bf937427", "1567591974664-9f5e016ed203", "1596708143467-33924fe56f10", "1616489953149-8051770217a2",
    "1510210119714-3c9900223ed7", "1617191519105-027581707393", "1545241047-6083a3684587", "1536964542287-0256bc5cd08b",
    "1614728263952-84ea206f94b6", "1606760227091-3dd870d97f1d", "1612475252876-1b48b7d7b7b7",
    // Textile/Clothing
    "1520903920243-00d872a2d1c9", "1582562124811-c09040d0a901", "1566150905458-1f3707718221", "1513511116-24388481313c",
    "1563203020-f38b2488a032", "1513519245088-0e12902e5a38",
    // Jewelry
    "1535632066927-ab7c9ab60908", "1605100804763-247f67b3557e", "1573408301185-9146fe634ad0", "1579783902614-a3fb3927b6a5"
];

async function verifyAndSeed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB...');

        const products = await Product.find({});
        console.log(`Analyzing ${products.length} products...`);

        if (products.length > craftPhotoIds.length) {
            console.error('CRITICAL: Need more unique photo IDs!');
            process.exit(1);
        }

        console.log('Verifying links with Unsplash...');
        const verifiedImages = [];
        
        for (let i = 0; i < products.length; i++) {
            const photoId = craftPhotoIds[i];
            const url = `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=800&q=80`;
            
            try {
                await axios.head(url);
                verifiedImages.push({ id: products[i]._id, url });
                console.log(`✅ Verified [${i+1}/${products.length}]: ${products[i].productName}`);
            } catch (err) {
                console.error(`❌ Failed [${i+1}/${products.length}]: ${products[i].productName} (${url})`);
                console.log('Attempting backup source...');
                // Fallback to a guaranteed working ID if Unsplash ID is finicky
                const backupUrl = `https://picsum.photos/seed/${products[i]._id}/800/600`;
                verifiedImages.push({ id: products[i]._id, url: backupUrl });
            }
        }

        console.log('Verification complete. Updating database...');
        for (const item of verifiedImages) {
            await Product.findByIdAndUpdate(item.id, { $set: { images: [item.url] } });
        }

        console.log('Database updated successfully with unique, working images!');
    } catch (err) {
        console.error('Seeding error:', err);
    } finally {
        process.exit(0);
    }
}

verifyAndSeed();
