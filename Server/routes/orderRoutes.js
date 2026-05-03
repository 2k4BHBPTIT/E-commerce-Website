// server/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const { checkAuth } = require('../middleware/auth'); // Middleware kiểm tra Token

router.post('/', checkAuth, async (req, res) => {
  try {
    const { orderItems, shippingAddress, phone, paymentMethod, totalPrice } = req.body;

    const normalizedOrderItems = Array.isArray(orderItems)
      ? orderItems.map((item) => ({
        name: item?.name,
        quantity: Number(item?.quantity ?? 1),
        image: item?.image || 'https://via.placeholder.com/300',
        price: item?.price,
        product: item?.product || item?._id,
      }))
      : [];

    if (!shippingAddress || !phone || !paymentMethod) return res.status(400).json({ msg: 'Thiếu thông tin giao hàng/thanh toán' });
    if (!normalizedOrderItems.length) return res.status(400).json({ msg: 'Giỏ hàng trống' });

    // Lấy thông tin User để chuẩn bị trừ tiền và cộng lượt quay
    const userDoc = await User.findById(req.user.id);
    
    // ====================================================
    // LOGIC 1: KIỂM TRA VÀ TRỪ TIỀN VÍ
    // ====================================================
    if (paymentMethod === 'Ví X-Billiard') {
      if (userDoc.walletBalance < totalPrice) {
        return res.status(400).json({ msg: 'Số dư ví không đủ! Vui lòng nạp thêm tiền.' });
      }
      // Trừ tiền trong ví
      userDoc.walletBalance -= totalPrice;
    }

    // Tạo đơn hàng mới
    const newOrder = new Order({
      user: req.user.id,
      orderItems: normalizedOrderItems,
      shippingAddress,
      phone,
      paymentMethod,
      totalPrice,
      // Nếu thanh toán bằng ví, đánh dấu Đã thanh toán ngay lập tức
      isPaid: paymentMethod === 'Ví X-Billiard' ? true : false,
      paidAt: paymentMethod === 'Ví X-Billiard' ? Date.now() : null,
      status: paymentMethod === 'Ví X-Billiard' ? 'Đã thanh toán' : 'Chờ xác nhận',
    });

    const savedOrder = await newOrder.save();

    // ====================================================
    // LOGIC 2: CỘNG LƯỢT QUAY MAY MẮN
    // ====================================================
    const eligibleItems = normalizedOrderItems.filter(item => item.price >= 2000000);
    if (eligibleItems.length > 0) {
      const totalSpinsEarned = eligibleItems.reduce((acc, item) => acc + item.quantity, 0);
      userDoc.luckySpins += totalSpinsEarned;
    }

    // LƯU TÀI KHOẢN (Đã cập nhật cả tiền ví và số lượt quay cùng lúc)
    await userDoc.save();

    res.status(201).json({ order: savedOrder, newBalance: userDoc.walletBalance });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ msg: 'Lỗi tạo đơn hàng', error: err?.message });
  }
    await Product.findByIdAndUpdate(item.product, {
      $inc: { countInStock: -item.quantity, sold: item.quantity }
    });
});

// 2. LẤY TẤT CẢ ĐƠN HÀNG (DÀNH CHO ADMIN)
router.get('/', checkAuth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Lỗi lấy đơn hàng:', err);
    res.status(500).json({ msg: 'Lỗi server khi lấy danh sách đơn hàng' });
  }
});

// 3. LẤY TẤT CẢ ĐƠN HÀNG (ALIAS /ALL DÀNH CHO ADMIN) - Đã sửa lỗi thiếu req
router.get('/all', checkAuth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Lỗi lấy đơn hàng:', err);
    res.status(500).json({ msg: 'Lỗi server khi lấy danh sách đơn hàng' });
  }
});

// 4. ADMIN XÁC NHẬN THANH TOÁN
router.put('/:id/pay', checkAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ msg: 'Không tìm thấy đơn hàng' });

    order.isPaid = true;
    order.paidAt = Date.now();

    if (order.status === 'Đang giao hàng' || order.status === 'Chờ xác nhận') {
      order.status = 'Hoàn thành';
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ msg: 'Lỗi khi cập nhật thanh toán' });
  }
});

// 5. ADMIN ĐỔI TRẠNG THÁI GIAO HÀNG
router.put('/:id/status', checkAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ msg: 'Không tìm thấy đơn hàng' });

    order.status = status;
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ msg: 'Lỗi khi cập nhật trạng thái đơn hàng' });
  }
});

// 6. LẤY LỊCH SỬ MUA HÀNG
router.get('/mine', checkAuth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Lỗi lấy lịch sử đơn hàng:", err);
    res.status(500).json({ msg: 'Lỗi server khi lấy lịch sử mua hàng' });
  }
});

module.exports = router;