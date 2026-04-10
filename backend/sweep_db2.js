const mongoose = require('mongoose'); 
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/artisan').then(async () => { 
  const Vendor = require('./models/Vendor'); 
  const vs = await Vendor.find({});
  let count = 0;
  for (let v of vs) {
    let changed = false;
    if (v.profileImage && v.profileImage.includes('unsplash')) {
      v.profileImage = '';
      changed = true;
    }
    if (v.bannerImage && v.bannerImage.includes('unsplash')) {
      v.bannerImage = '';
      changed = true;
    }
    if (changed) {
      await v.save();
      count++;
    }
  }
  console.log('Swept and corrected vendors:', count);
  process.exit(0); 
});
