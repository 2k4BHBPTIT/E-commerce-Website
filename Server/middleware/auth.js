const jwt = require('jsonwebtoken');

// 1. CHỐT BẢO VỆ 1: Kiểm tra xem người dùng đã Đăng Nhập chưa
const checkAuth = (req, res, next) => {
  try {
    // Lấy token từ header (hoặc cookie tùy cách bạn setup)
    const token = req.headers.authorization?.split(" ")[1] || req.cookies?.token;
    
    if (!token) {
      return res.status(401).json({ msg: 'Vui lòng đăng nhập để tiếp tục!' });
    }

    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
    const decoded = jwt.verify(token, jwtSecret);
    
    req.user = decoded; // Lưu thông tin user vào req để các API sau sử dụng
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!' });
    }
    res.status(401).json({ msg: 'Phiên đăng nhập không hợp lệ!' });
  }
};

// 2. CHỐT BẢO VỆ 2: Kiểm tra xem người dùng có phải là ADMIN không
const checkAdmin = (req, res, next) => {
  // Yêu cầu phải vượt qua checkAuth trước, nên req.user chắc chắn tồn tại
  if (req.user && req.user.role === 'admin') {
    next(); // Đúng là Admin -> Cho phép đi tiếp vào API
  } else {
    res.status(403).json({ msg: 'Truy cập bị từ chối. Khu vực dành riêng cho Admin!' });
  }
};

// BẮT BUỘC XUẤT CẢ 2 HÀM RA ĐỂ CÁC FILE ROUTE SỬ DỤNG
module.exports = { checkAuth, checkAdmin };
