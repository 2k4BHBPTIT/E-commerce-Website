const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { checkAuth, checkAdmin } = require('../middleware/auth');
const SystemLog = require('../models/SystemLog');

// 1. API LẤY SẢN PHẨM CHÍNH (Có Search, Filter, Pagination)
router.get('/', async (req, res) => {
  try {
    const { search, category, sort, page = 1, limit = 16 } = req.query;
    let query = {};
    const trimmedSearch = search ? String(search).trim() : '';

    if (trimmedSearch) {
      query.name = { $regex: trimmedSearch, $options: 'i' };
    }

    // Xử lý lọc theo danh mục (Phải đặt TRƯỚC khi find)
    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    // Xử lý Sắp xếp
    let sortOptions = {};
    if (sort === 'price-asc') sortOptions.price = 1;
    if (sort === 'price-desc') sortOptions.price = -1;

    const skip = (page - 1) * limit;
    const total = await Product.countDocuments(query);

    // Áp dụng đầy đủ điều kiện query (search + category) khi lấy danh sách
    const products = await Product.find(query).select('-importPrice')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    // CHỈ GỬI JSON MỘT LẦN DUY NHẤT Ở CUỐI
    res.json({
      products,
      total,
      pages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ msg: 'Lỗi lấy dữ liệu sản phẩm' });
  }
});

router.get('/get-featured', async (req, res) => {
  try {
    // Nhờ MongoDB tìm tất cả SP có isFeatured = true, sắp xếp mới nhất lên đầu
    const featuredProducts = await Product.find({ isFeatured: true }).sort({ createdAt: -1 });
    res.json(featuredProducts);
  } catch (err) {
    res.status(500).json({ msg: 'Lỗi lấy sản phẩm nổi bật' });
  }
});

router.get('/admin/all', checkAuth, async (req, res) => {
  try {
    // Admin thì được quyền lấy toàn bộ (không dùng .select('-importPrice'))
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: 'Lỗi server' });
  }
});

router.put('/:id', checkAuth, checkAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // Tự động lấy tất cả các trường gửi lên (Bao gồm cả countInStock)
      { new: true }
    );
    res.json(updatedProduct);
  } catch (err) {
    console.error("Lỗi khi cập nhật sản phẩm:", err);
    res.status(500).json({ msg: 'Lỗi cập nhật', error: err.message });
  }
});

// API XÓA SẢN PHẨM (Nằm TRÊN module.exports)
router.delete('/:id', checkAuth, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    await SystemLog.create({
      admin: req.user.id,
      action: 'DELETE_PRODUCT',
      details: `Đã xóa sản phẩm ID: ${req.params.id}`,
      ipAddress: req.ip
    });
    res.json({ msg: 'Đã xóa sản phẩm' });
  } catch (err) {
    res.status(500).json({ msg: 'Lỗi khi xóa sản phẩm' });
  }
});

router.post('/', checkAuth, checkAdmin, async (req, res) => {
  try {
    // Thêm countInStock vào đây
    const { name, price, oldPrice, image, brand, category, description, countInStock, isFeatured } = req.body;

    const newProduct = new Product(req.body);

    await newProduct.save();
    await SystemLog.create({
      admin: req.user.id,
      action: 'CREATE_PRODUCT',
      details: `Đã tạo sản phẩm ID: ${newProduct._id}`,
      ipAddress: req.ip
    });
    res.status(201).json(newProduct);
  } catch (err) {
    console.error("Lỗi khi tạo sản phẩm:", err);
    res.status(500).json({ msg: 'Lỗi tạo sản phẩm', error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Không tìm thấy sản phẩm' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: 'Lỗi server' });
  }
});

router.post('/:id/reviews', checkAuth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ msg: 'Không tìm thấy sản phẩm' });

    // Kiểm tra xem user này đã bình luận sản phẩm này chưa
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user.id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ msg: 'Bạn đã đánh giá sản phẩm này rồi!' });
    }

    // Tạo bình luận mới
    const review = {
      user: req.user.id,
      name: req.user.name || 'Khách hàng', // Lấy tên từ token
      rating: Number(rating),
      comment,
    };

    // Đẩy vào mảng reviews của sản phẩm
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    // Tính lại điểm trung bình
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ msg: 'Thêm đánh giá thành công!' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Lỗi server khi thêm đánh giá' });
  }
});


module.exports = router;