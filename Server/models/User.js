const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user', enum: ['user', 'admin'] }, // Phân quyền
  walletBalance: { 
    type: Number, 
    default: 0 
  },
  luckySpins: { 
    type: Number, 
    default: 0 
  },
  vouchers: [
    {
      code: String,
      discountAmt: Number,
      itemName: String, 
      expiryDate: Date,
      isUsed: { type: Boolean, default: false }
    }
  ],
  wishlist: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product' 
  }],
// BỔ SUNG 2: SỔ ĐỊA CHỈ (Lưu tối đa 3 địa chỉ)
  savedAddresses: [{
    name: String,
    phone: String,
    address: String, // Chuỗi địa chỉ đầy đủ
    type: { type: String, enum: ['Nhà riêng', 'Cơ quan', 'Khách', 'Club Bida'], default: 'Nhà riêng' },
    isDefault: { type: Boolean, default: false } // Địa chỉ mặc định
  }],
  resetPasswordOTP: { type: String },
  resetPasswordExpires: { type: Date },
}, { timestamps: true });


module.exports = mongoose.model('User', UserSchema);