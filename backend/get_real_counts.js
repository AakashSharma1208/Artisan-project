const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Vendor = require('./models/Vendor');
const Product = require('./models/Product');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const totalVendors = await Vendor.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'user' });
    
    const userCities = await User.distinct('address.city');
    const vendorCities = await Vendor.distinct('location');
    const allCities = new Set([...userCities, ...vendorCities].filter(Boolean));
    const totalCities = allCities.size;

    console.log('REAL STATS:');
    console.log({
        totalVendors,
        totalProducts,
        totalCustomers,
        totalCities
    });
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
