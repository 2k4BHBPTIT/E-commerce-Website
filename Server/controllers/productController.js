const Product = require('../models/Product');
const { search } = req.query;
let query = {};
if (search) {
    query.name = { $regex: search, $options: 'i' }; // Tìm kiếm không phân biệt hoa thường
}
const products = await Product.find(query);
// 1. Lấy danh sách sản phẩm (có lọc & phân trang)
exports.getProducts = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    let query = {};

    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };

    const products = await Product.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: 'Lỗi server' });
  }
};

// 2. Thêm sản phẩm mới
exports.createProduct = async (req, res) => {
  try {
    const { name, category, price, description, stock, weight, tipSize } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';

    const newProduct = new Product({
      name, category, price, description, stock, image,
      specs: { weight, tipSize }
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ msg: 'Dữ liệu không hợp lệ' });
  }
};

// 3. Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
  try {
    const updatedData = { ...req.body };
    if (req.file) updatedData.image = `/uploads/${req.file.filename}`;

    const product = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.json(product);
  } catch (err) {
    res.status(400).json({ msg: 'Cập nhật thất bại' });
  }
};

// 4. Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ msg: 'Đã xóa sản phẩm' });
};