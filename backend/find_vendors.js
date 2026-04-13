const mongoose = require('mongoose');
require('dotenv').config();

async function find() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const Vendor = mongoose.model('Vendor', new mongoose.Schema({ email: String, vendorName: String }));
        const vendors = await Vendor.find({ email: { $in: ['aakash@aakashcrafts.com', 'creative@creativehands.com'] } });
        console.log(JSON.stringify(vendors.map(v => ({ id: v._id, name: v.vendorName, email: v.email })), null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        process.exit(0);
    }
}

find();
