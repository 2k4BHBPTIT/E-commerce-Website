const express = require('express');
const router = express.Router();
const Deal = require('../models/Deal');
const Product = require('../models/Product');
const { checkAuth, checkAdmin } = require('../middleware/auth');

// 1. PUBLIC: Lấy danh sách Deal đang chạy (Dành cho trang chủ)
router.get('/', async (req, res) => {
  try {
    const now = new Date();
    const activeDeals = await Deal.find({ endTime: { $gt: now } }).populate('product');
    
    const dealProducts = activeDeals.map(deal => {
      return {
        ...deal.product._doc,
        dealPrice: deal.dealPrice,
        dealEndTime: deal.endTime,
        dealId: deal._id
      };
    });

    res.json({ dealProducts });
  } catch (err) {
    res.status(500).json({ msg: 'Lỗi lấy danh sách Deal' });
  }
});

// 2. ADMIN: Lấy tất cả Deal (Để quản lý trong AdminDeals.jsx)
router.get('/admin/all', checkAuth, checkAdmin, async (req, res) => {
  try {
    const deals = await Deal.find().populate('product').sort({ endTime: -1 });
    res.json(deals);
  } catch (err) {
    res.status(500).json({ msg: 'Lỗi server' });
  }
});

// 3. ADMIN: Tạo Deal mới
router.post('/', checkAuth, checkAdmin, async (req, res) => {
  try {
    const { productId, dealPrice, endTime } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ msg: 'Không tìm thấy sản phẩm' });
    if (dealPrice >= product.price) return res.status(400).json({ msg: 'Giá Deal phải RẺ HƠN giá gốc!' });

    const newDeal = await Deal.findOneAndUpdate(
      { product: productId },
      { dealPrice, endTime },
      { new: true, upsert: true }
    ).populate('product');

    res.status(201).json(newDeal);
  } catch (err) {
    res.status(500).json({ msg: 'Lỗi tạo Deal' });
  }
});

// 4. ADMIN: Xóa Deal
router.delete('/:id', checkAuth, checkAdmin, async (req, res) => {
  try {
    await Deal.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Đã xóa Deal thành công!' });
  } catch (err) {
    res.status(500).json({ msg: 'Lỗi khi xóa Deal' });
  }
});

module.exports = router;