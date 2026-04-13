const mongoose = require('mongoose');
require('dotenv').config();

const Product = mongoose.model('Product', new mongoose.Schema({
    productName: String,
    images: [String]
}));

const imageMapping = {
    // Aakash Crafts
    "Royal Teal Ceramic Vase": "photo-1581009117865-ecda3d48becc",
    "Hand-Carved Teak Elephant": "photo-1544967082-d9d25d867d66",
    "Blue Pottery Dinner Set": "photo-1610701596007-11502861dcfa",
    "Sandalwood Incense Holder": "photo-1602853183816-1f307328901a",
    "Terracotta Mural Wall Art": "photo-1581783898377-1c85bf937427",
    "Rosewood Jewelry Chest": "photo-1590736910118-24388481313c",
    "Traditional Warli Painting": "photo-1501472312651-726afe119ff1",
    "Earthen Clay Tea Cups (Set of 6)": "photo-1515696423086-05947c341e4a",
    "Brass Ganesha Statue": "photo-1567591974664-9f5e016ed203",
    "Bamboo Weave Fruit Basket": "photo-1596708143467-33924fe56f10",
    "Marble Inlay Coasters": "photo-1616489953149-8051770217a2",
    "Hand-Painted Kathakali Mask": "photo-1510210119714-3c9900223ed7",
    "Copper Hammered Jug": "photo-1617191519105-027581707393",
    "Stone Carved Diya Lamp": "photo-1574633753331-57fc47113197",
    "Walnut Wood Phone Stand": "photo-1533230114008-0129ae3e62f4",

    // Creative Hands Studio
    "Pashmina Wool Scarf": "photo-1520903920243-00d872a2d1c9",
    "Hand-Beaded Boho Necklace": "photo-1581404476143-df3137e234c6",
    "Silk Embroidered Clutch": "photo-1566150905458-1f3707718221",
    "Block-Print Cotton Tunic": "photo-1603514285070-6523091d3ced",
    "Macrame Hanging Planter": "photo-1545241047-6083a3684587",
    "Sterling Silver Tribal Rings": "photo-1605100804763-247f67b3557e",
    "Felt Wool Nursery Mobile": "photo-1612475252876-1b48b7d7b7b7",
    "Hand-Bound Leather Journal": "photo-1531346878377-a5be20888e57",
    "Braided Jute Handbag": "photo-1594223274512-ad4803739b7c",
    "Crochet Throw Blanket": "photo-1606760227091-3dd870d97f1d",
    "Ceramic Bead Bracelet": "photo-1573408301185-9146fe634ad0",
    "Recycled Glass Candle Holder": "photo-1614728263952-84ea206f94b6",
    "Tie-Dye Silk Scarf": "photo-1610210119714-3c9900223ed7",
    "Hand-Knotted Dreamcatcher": "photo-1536964542287-0256bc5cd08b",
    "Brass Inlay Wooden Mirror": "photo-1618220179428-22790b461013",

    // Existing / Others
    "Hand-Painted Madhubani Canvas": "photo-1579783902614-a3fb3927b6a5",
    "Handwoven Cotton Dupatta": "photo-1582562124811-c09040d0a901",
    "Minimalist Ceramic Vase": "photo-1612196808214-b9e1d614e38a",
    "Abstract Wall Art Frame": "photo-1515405295579-ba7b45403062",
    "Handmade Resin Jewelry Set": "photo-1535632066927-ab7c9ab60908"
};

async function update() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB...');

        const products = await Product.find({});
        console.log(`Updating ${products.length} products with unique images...`);

        let updatedCount = 0;
        for (const product of products) {
            const photoId = imageMapping[product.productName];
            if (photoId) {
                const url = `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=800&q=80`;
                product.images = [url];
                await product.save();
                updatedCount++;
            }
        }

        console.log(`Successfully updated ${updatedCount} products with unique, category-relevant images!`);
    } catch (err) {
        console.error('Update error:', err);
    } finally {
        process.exit(0);
    }
}

update();
