const mongoose = require('mongoose'); 
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/artisan').then(async () => { 
  const Vendor = require('./models/Vendor'); 
  const v = await Vendor.findOne({ vendorName: 'space' }); 
  console.log('Length:', v && v.profileImage ? v.profileImage.length : 0); 
  console.log('Start:', v && v.profileImage ? v.profileImage.substring(0, 50) : ''); 
  process.exit(0); 
});
