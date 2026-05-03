const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { register, login } = require('../controllers/authController');
const { checkAuth } = require('../middleware/auth');

// Đăng ký
router.post('/register', register);

// Đăng nhập
router.post('/login', login);

// Lấy thông tin user đang đăng nhập (dựa vào token trong cookie)
router.get('/me', checkAuth, async (req, res) => {
  try {
    const user = await require('../models/User').findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Lỗi server khi lấy thông tin người dùng' });
  }
});

// Đăng xuất
router.post('/logout', (req, res) => {
  res
    .cookie('token', '', { maxAge: 0, httpOnly: true })
    .json({ msg: 'Đã đăng xuất' });
});

module.exports = router;
