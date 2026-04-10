const mongoose = require('mongoose'); 
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/artisan').then(async () => { 
  const Vendor = require('./models/Vendor'); 
  
  const profileRes = await Vendor.updateMany(
    { profileImage: { $regex: 'unsplash|placeholder' } }, 
    { $set: { profileImage: '' } }
  );
  
  const bannerRes = await Vendor.updateMany(
    { bannerImage: { $regex: 'unsplash|placeholder' } }, 
    { $set: { bannerImage: '' } }
  );

  console.log('Swept Profile Images:', profileRes.modifiedCount);
  console.log('Swept Banner Images:', bannerRes.modifiedCount);

  process.exit(0); 
});
