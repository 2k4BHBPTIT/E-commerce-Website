#!/usr/bin/env node
// Migration script: Re-hash passwords properly
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/billiardshop';

async function migratePasswords() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const userSchema = new mongoose.Schema({
      name: String, email: String, password: String, role: String,
      walletBalance: Number, luckySpins: Number, vouchers: Array,
      wishlist: Array, savedAddresses: Array,
      resetPasswordOTP: String, resetPasswordExpires: Date,
      lastLoginAt: Date, isActive: Boolean
    }, { timestamps: true });
    
    const User = mongoose.model('UserTemp', userSchema, 'users');
    const users = await User.find({}).select('+password');
    console.log(`📊 Found ${users.length} users`);

    // Known password mappings for testing accounts
    const knownPasswords = {
      'a@gmail.com': '123456',
      'b@gmail.com': '123456', 
      'builetien77@gmail.com': '123456'
    };

    let fixedCount = 0;
    for (const user of users) {
      const plainPwd = knownPasswords[user.email];
      if (!plainPwd) {
        console.log(`⚠️  No known password for ${user.email}`);
        continue;
      }
      
      // Check if current hash is valid
      const isValid = await bcrypt.compare(plainPwd, user.password);
      if (isValid) {
        console.log(`✅ ${user.email}: password already valid`);
        continue;
      }
      
      // Re-hash with proper bcrypt
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(plainPwd, salt);
      await user.save();
      fixedCount++;
      console.log(`🔄 Re-hashed password for ${user.email}`);
    }

    console.log(`\n📈 Complete! Fixed: ${fixedCount} passwords`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    console.error(err.stack);
    process.exit(1);
  }
}

migratePasswords();
