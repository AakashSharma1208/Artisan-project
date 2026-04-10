const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const DB_URI = 'mongodb://127.0.0.1:27017/artisan';

const fixPasswords = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log('Connected. Fixing passwords...');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const result = await User.updateMany(
            { email: { $in: ['aakash@aakashcrafts.com', 'creative@creativehands.com'] } },
            { $set: { password: hashedPassword } }
        );

        console.log(`Updated ${result.modifiedCount} vendor passwords to hashed version of 'password123'`);

        process.exit(0);
    } catch (err) {
        console.error('Error fixing passwords:', err);
        process.exit(1);
    }
};

fixPasswords();
