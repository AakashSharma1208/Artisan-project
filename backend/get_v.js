const mongoose = require('mongoose'); 
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/artisan').then(async () => {
  const Vendor = require('./models/Vendor');
  const v = await Vendor.findOne({ vendorName: 'space' });
  console.log(JSON.stringify(v, null, 2));
  process.exit(0);
});
