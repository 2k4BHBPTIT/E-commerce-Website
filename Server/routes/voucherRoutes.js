const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Gọi model User
const { checkAuth } = require('../middleware/auth'); // Bắt buộc đăng nhập để dùng mã

router.post('/apply', checkAuth, async (req, res) => {
  try {
    const { code, cartTotal } = req.body;
    
    // 1. Tìm thông tin User và kho Voucher của họ trong DB
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'Không tìm thấy tài khoản!' });

    // 1b. Dọn dẹp: Xóa tất cả voucher đã hết hạn khỏi cơ sở dữ liệu (không đợi đến lúc apply)
    const now = new Date();
    const vouchersBeforeCleanup = user.vouchers.length;
    user.vouchers = user.vouchers.filter(v => new Date(v.expiryDate) >= now);
    if (user.vouchers.length !== vouchersBeforeCleanup) {
      await user.save();
    }

    // 2. Lục lọi xem trong ví của user có cái mã (code) mà họ vừa nhập không
    const voucher = user.vouchers.find(v => v.code === code.toUpperCase());

    if (!voucher) {
      return res.status(400).json({ msg: 'Mã không tồn tại, không thuộc về bạn hoặc đã hết hạn!' });
    }

    // 3. Kiểm tra các điều kiện: Đã dùng chưa?
    if (voucher.isUsed) {
      return res.status(400).json({ msg: 'Mã này bạn đã sử dụng rồi!' });
    }
    // Kiểm tra hết hạn (để phòng trường hợp vừa mới tạo xong đã đến hạn)
    if (new Date(voucher.expiryDate) < now) {
      // Xóa voucher hết hạn khỏi DB luôn
      user.vouchers = user.vouchers.filter(v => v.code !== voucher.code);
      await user.save();
      return res.status(400).json({ msg: 'Rất tiếc, mã giảm giá này đã hết hạn!' });
    }

    // 4. "Dịch" tên phần thưởng (VD: "Voucher 10%" hoặc "Voucher 200K") thành tiền thật
    let discountAmount = 0;
    const itemName = voucher.itemName.toUpperCase(); // Tên lưu trong DB

    if (itemName.includes('%')) {
      // Nếu là mã phần trăm: Tách lấy chữ số (VD: 10) và nhân với tổng tiền
      const percent = parseInt(itemName.replace(/[^0-9]/g, '')); 
      discountAmount = (cartTotal * percent) / 100;
    } 
    else if (itemName.includes('K')) {
      // Nếu là mã tiền mặt (K): Tách lấy chữ số (VD: 200) và nhân 1000
      const amount = parseInt(itemName.replace(/[^0-9]/g, ''));
      discountAmount = amount * 1000;
    }

    // Đảm bảo không bao giờ giảm giá lố qua tổng tiền đơn hàng (VD đơn 50k áp mã 200k)
    if (discountAmount > cartTotal) {
      discountAmount = cartTotal;
    }

    // 5. Trả tiền giảm giá về cho Frontend
    res.json({ 
      msg: 'Áp dụng mã thành công!', 
      discountAmount: discountAmount,
      code: voucher.code
    });

  } catch (err) {
    console.error("Lỗi áp mã DB:", err);
    res.status(500).json({ msg: 'Lỗi máy chủ khi xác thực mã.' });
  }
});

// 6. ĐẠO DỤC VOUCHER: LẤY TẤT CẢ VOUCHER CÒN HẠN VÀ DỌN DẠNG ĐÃ SẮP XẾP
// (Tự động xóa voucher hết hạn mỗi khi user truy vấn)
router.get('/mine', checkAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'Không tìm thấy tài khoản!' });

    const now = new Date();
    // Dọn dẹp: Xóa voucher hết hạn
    const beforeCount = user.vouchers.length;
    user.vouchers = user.vouchers.filter(v => new Date(v.expiryDate) >= now);
    if (user.vouchers.length !== beforeCount) {
      await user.save();
    }

    // Trả về danh sách voucher còn hạn, sắp xếp: voucher chưa dùng lên đầu, sắp theo ngày hết hạn gần nhất
    const activeVouchers = user.vouchers
      .filter(v => !v.isUsed)
      .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

    const usedVouchers = user.vouchers
      .filter(v => v.isUsed)
      .sort((a, b) => new Date(b.expiryDate) - new Date(a.expiryDate));

    res.json({ 
      vouchers: [...activeVouchers, ...usedVouchers],
      cleaned: beforeCount - user.vouchers.length
    });
  } catch (err) {
    console.error("Lỗi lấy danh sách voucher:", err);
    res.status(500).json({ msg: 'Lỗi server khi lấy danh sách voucher.' });
  }
});

// 7. DỌN DẠNG LẠI MÃ VOUCHER: ĐÁNH DẤU ĐÃ DÙNG (khi order hoàn tất)
router.put('/use/:code', checkAuth, async (req, res) => {
  try {
    const { code } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'Không tìm thấy tài khoản!' });

    const voucher = user.vouchers.find(v => v.code === code.toUpperCase());
    if (!voucher) {
      return res.status(404).json({ msg: 'Không tìm thấy voucher!' });
    }

    if (voucher.isUsed) {
      return res.status(400).json({ msg: 'Voucher này đã được sử dụng!' });
    }

    if (new Date(voucher.expiryDate) < new Date()) {
      // Xóa luôn nếu vừa check thấy hết hạn
      user.vouchers = user.vouchers.filter(v => v.code !== code.toUpperCase());
      await user.save();
      return res.status(400).json({ msg: 'Voucher đã hết hạn!' });
    }

    voucher.isUsed = true;
    await user.save();

    res.json({ msg: 'Voucher đã được đánh dấu là đã sử dụng', voucher });
  } catch (err) {
    console.error("Lỗi đánh dấu voucher đã dùng:", err);
    res.status(500).json({ msg: 'Lỗi server khi cập nhật trạng thái voucher.' });
  }
});

// 8. DỌN DẠNG: XÓA VOUCHER (user tự xóa voucher đã hết hạn/đã dùng)
router.delete('/:code', checkAuth, async (req, res) => {
  try {
    const { code } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'Không tìm thấy tài khoản!' });

    const voucherIndex = user.vouchers.findIndex(v => v.code === code.toUpperCase());
    if (voucherIndex === -1) {
      return res.status(404).json({ msg: 'Không tìm thấy voucher!' });
    }

    const removed = user.vouchers.splice(voucherIndex, 1)[0];
    await user.save();

    res.json({ msg: 'Đã xóa voucher', voucher: removed });
  } catch (err) {
    console.error("Lỗi xóa voucher:", err);
    res.status(500).json({ msg: 'Lỗi server khi xóa voucher.' });
  }
});

module.exports = router;