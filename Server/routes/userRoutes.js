// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const { checkAuth, checkAdmin } = require('../middleware/auth');
const {OAuth2Client} = require('google-auth-library');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ==========================================
// 1. API ĐĂNG KÝ TÀI KHOẢN (MỚI BỔ SUNG)
// ==========================================
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Kiểm tra email đã tồn tại chưa
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Email này đã được đăng ký!' });

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo User mới
    user = new User({
      name, email, password: hashedPassword,
      role: 'user', walletBalance: 0, luckySpins: 0, vouchers: []
    });
    await user.save();

    // Cấp Token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'BiMatCuaHuyBich', { expiresIn: '1d' });
    
    res.status(201).json({ 
      message: 'Đăng ký thành công', 
      token, 
      user: { id: user._id, name: user.name, email: user.email, role: user.role, walletBalance: user.walletBalance, luckySpins: user.luckySpins, vouchers: user.vouchers, savedAddresses: user.savedAddresses } 
    });
  } catch (err) {
    console.error("Lỗi đăng ký:", err);
    res.status(500).json({ message: 'Lỗi server khi đăng ký' });
  }
});

// ==========================================
// 2. API ĐĂNG NHẬP (MỚI BỔ SUNG)
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Kiểm tra tài khoản có tồn tại không
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Tài khoản không tồn tại!' });

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Sai mật khẩu!' });

    // Cấp Token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'BiMatCuaHuyBich', { expiresIn: '1d' });
    
    res.json({ 
      message: 'Đăng nhập thành công', 
      token, 
      user: { id: user._id, name: user.name, email: user.email, role: user.role, walletBalance: user.walletBalance, luckySpins: user.luckySpins, vouchers: user.vouchers, savedAddresses: user.savedAddresses } 
    });
  } catch (err) {
    console.error("Lỗi đăng nhập:", err);
    res.status(500).json({ message: 'Lỗi server khi đăng nhập' });
  }
});

// ==========================================
// 3. API LẤY THÔNG TIN USER HIỆN TẠI (MỚI BỔ SUNG)
// ==========================================
router.get('/me', checkAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// ==========================================
// 4. API GOOGLE LOGIN (Đã fix lỗi googleClient)
// ==========================================
router.post('/google-login', async (req, res) => {
  try {
    const { credential } = req.body;

    // ĐÃ SỬA: Đổi googleClient thành client
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID || '973145122274-hm8shq5rv2ueo41kpidijd9pglctnk4v.apps.googleusercontent.com',
    });
    
    const payload = ticket.getPayload();
    const { email, name, picture, sub } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name: name,
        email: email,
        password: sub, 
        role: 'user',
        walletBalance: 0,
        luckySpins: 0,
        vouchers: []
      });
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'BiMatCuaHuyBich', 
      { expiresIn: '1d' }
    );

    res.json({
      msg: 'Đăng nhập Google thành công',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, walletBalance: user.walletBalance, luckySpins: user.luckySpins, vouchers: user.vouchers, savedAddresses: user.savedAddresses }
    });

  } catch (error) {
    console.error("Lỗi Google Login:", error);
    res.status(500).json({ msg: 'Xác thực Google thất bại' });
  }
});

// ==========================================
// CÁC API KHÁC GIỮ NGUYÊN (Xóa, Cập nhật, Thêm địa chỉ, Vòng quay...)
// ==========================================

// API Xóa người dùng (Chỉ Admin)
router.delete('/:id', checkAuth, checkAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'Người dùng không tồn tại' });
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ msg: 'Bạn không thể tự xóa tài khoản của chính mình!' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Đã xóa người dùng thành công' });
  } catch (err) {
    res.status(500).json({ msg: 'Lỗi server khi xóa người dùng' });
  }
});

// API Cập nhật người dùng (Chỉ Admin)
router.put('/:id', checkAuth, checkAdmin, async (req, res) => {
  try {
    const { name, email, role, walletBalance, luckySpins } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'Người dùng không tồn tại' });

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    if (walletBalance !== undefined) user.walletBalance = walletBalance;
    if (luckySpins !== undefined) user.luckySpins = luckySpins;

    await user.save();
    res.json({ msg: 'Cập nhật người dùng thành công', user });
  } catch (err) {
    res.status(500).json({ msg: 'Lỗi server khi cập nhật người dùng' });
  }
});

// API Lấy tất cả người dùng cho Admin
router.get('/all', checkAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Lỗi server khi lấy người dùng' });
  }
});

router.post('/claim-prize', checkAuth, async (req, res) => {
  try {
    const { prize } = req.body;
    const user = await User.findById(req.user.id);

    if (user.luckySpins <= 0) return res.status(400).json({ msg: 'Bạn đã hết lượt quay!' });

    user.luckySpins -= 1;
    let newVoucherCode = null;

    if (prize.type !== 'miss') {
      newVoucherCode = 'XBIL-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30); 

      let discountAmt = 0;
      if (prize.text.includes('50K')) discountAmt = 50000;
      if (prize.text.includes('100K')) discountAmt = 100000;

      user.vouchers.push({
        code: newVoucherCode,
        itemName: prize.text, 
        type: prize.type,     
        discountAmt: discountAmt,
        expiryDate: expiryDate
      });
    }

    await user.save();
    res.json({ success: true, luckySpins: user.luckySpins, voucherCode: newVoucherCode });
  } catch (err) {
    res.status(500).json({ msg: 'Lỗi server khi nhận thưởng' });
  }
});

router.post('/deposit', checkAuth, async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ msg: 'Số tiền nạp không hợp lệ' });

    const user = await User.findById(req.user.id);
    user.walletBalance += Number(amount);
    await user.save();

    res.json({ success: true, walletBalance: user.walletBalance, msg: `Đã nạp thành công!` });
  } catch (err) {
    res.status(500).json({ msg: 'Lỗi server khi nạp tiền' });
  }
});

router.post('/address', checkAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.savedAddresses.push(req.body); 
    await user.save();
    res.json({ msg: 'Đã thêm địa chỉ', addresses: user.savedAddresses });
  } catch (err) {
    res.status(500).json({ msg: 'Lỗi server' });
  }
});

router.get('/wishlist', checkAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ msg: 'Lỗi server' });
  }
});

router.post('/wishlist', checkAuth, async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user.id);
    
    const index = user.wishlist.indexOf(productId);
    if (index === -1) {
      user.wishlist.push(productId); 
    } else {
      user.wishlist.splice(index, 1); 
    }
    
    await user.save();
    res.json({ msg: 'Đã cập nhật Wishlist' });
  } catch (err) {
    res.status(500).json({ msg: 'Lỗi server' });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'Email này chưa được đăng ký trong hệ thống!' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const message = `<div style="padding: 20px; text-align: center;"><h2>Mã OTP của bạn là: ${otp}</h2></div>`;
    // Nhớ cấu hình hàm sendEmail của bạn cho đúng
    // await sendEmail({ email: user.email, subject: 'Mã xác nhận', message: message });

    res.status(200).json({ message: 'Mã xác nhận đã được gửi đến email của bạn!' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi máy chủ! Không thể gửi email lúc này.' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email: email, resetPasswordOTP: otp, resetPasswordExpires: { $gt: Date.now() } });

    if (!user) return res.status(400).json({ message: 'Mã OTP không hợp lệ hoặc đã hết hạn!' });
    if (newPassword.length < 6) return res.status(400).json({ message: 'Mật khẩu mới phải từ 6 ký tự trở lên!' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Đổi mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới.' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi máy chủ khi đặt lại mật khẩu.' });
  }
});

router.put('/address/default/:addressId', checkAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.savedAddresses.forEach(addr => {
      addr.isDefault = addr._id.toString() === req.params.addressId;
    });
    await user.save();
    res.json({ msg: 'Đã đặt địa chỉ mặc định!', addresses: user.savedAddresses });
  } catch (err) {
    res.status(500).json({ msg: 'Lỗi server' });
  }
});

module.exports = router;