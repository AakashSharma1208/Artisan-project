const mongoose = require('mongoose');
const Product = require('./backend/models/Product');

mongoose.connect('mongodb://127.0.0.1:27017/artisan')
  .then(async () => {
    console.log('Connected to DB');
    const products = await Product.find().limit(5);
    console.log('Products:', JSON.stringify(products, null, 2));
    mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    mongoose.disconnect();
  });
