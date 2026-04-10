const mongoose = require('mongoose'); 
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/artisan').then(async () => { 
  const Vendor = require('./models/Vendor'); 
  const vs = await Vendor.find({}); 
  vs.forEach(v => {
    console.log('Vendor:', v.vendorName, '| ProfileLen:', v.profileImage ? v.profileImage.length : 0, '| BannerLen:', v.bannerImage ? v.bannerImage.length : 0);
    if(v.bannerImage && v.bannerImage.includes('unsplash')) {
      console.log('UNSPLASH DETECTED:', v.bannerImage.substring(0, 80));
    }
  }); 
  process.exit(0); 
});
