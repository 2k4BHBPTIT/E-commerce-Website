// src/components/ProductCard.jsx
import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, RotateCcw, Info, Heart } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [isLiked, setIsLiked] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  // ==========================================
  // STATE: XỬ LÝ HIỆU ỨNG ZOOM KÍNH LÚP
  // ==========================================
  const [zoomStyle, setZoomStyle] = useState({ display: 'none' });
  const imageUrl = product.image?.startsWith('http') ? product.image : `http://localhost:5000/uploads/${product.image}`;

  const handleMouseMove = (e) => {
    // Lấy tọa độ và kích thước của khung chứa ảnh
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    
    // Tính toán vị trí chuột tương đối bên trong bức ảnh
    const x = e.clientX - left;
    const y = e.clientY - top;

    // Quy đổi ra phần trăm (0% đến 100%) để dịch chuyển background
    const bgPosX = (x / width) * 100;
    const bgPosY = (y / height) * 100;

    setZoomStyle({
      display: 'block',
      backgroundImage: `url(${imageUrl})`,
      backgroundPosition: `${bgPosX}% ${bgPosY}%`,
      backgroundSize: '600%', // Độ phóng đại (Zoom 2.5 lần để soi rõ vân gỗ)
      left: `${x}px`,
      top: `${y}px`,
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none' }); // Tắt kính lúp khi đưa chuột ra ngoài
  };

  useEffect(() => {
    if (user && user.wishlist) {
      const isSaved = user.wishlist.some(item => 
        item === product._id || item._id === product._id
      );
      setIsLiked(isSaved);
    }
  }, [user, product._id]);

  return (
    // ĐÃ XÓA CLASS `italic` Ở ĐÂY ĐỂ CHỮ KHÔNG BỊ NGHIÊNG NỮA
    <div className="relative w-full h-[420px] bg-transparent group [perspective:1000px]">

      {/* KHỐI TRỤC QUAY: Xử lý hiệu ứng lật 180 độ */}
      <div
        className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
      >

        {/* ==========================================
            MẶT TRƯỚC (FRONT) - ẢNH & NÚT THÊM GIỎ HÀNG
        ========================================== */}
        <div className="absolute inset-0 w-full h-full bg-white rounded-2xl shadow-sm group-hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden [backface-visibility:hidden] flex flex-col">

          {/* KHU VỰC HÌNH ẢNH (Gắn sự kiện di chuột vào đây) */}
          <div 
            className="relative w-full h-[55%] overflow-hidden bg-gray-50 border-b border-gray-100 cursor-crosshair group/zoom"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseMove}
          >
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700"
            />

            {/* KÍNH LÚP (CỬA SỔ ZOOM MỚI NỔI LÊN) */}
            <div
              className="absolute z-[100] border-4 border-white shadow-[0_10px_40px_rgba(0,0,0,0.4)] rounded-2xl pointer-events-none transition-opacity duration-200 bg-no-repeat bg-white"
              style={{
                ...zoomStyle,
                width: '160px',
                height: '160px',
                transform: 'translate(-50%, -50%)', // Căn giữa kính lúp ngay tại tâm mũi tên chuột
              }}
            />
            
            {/* CỤM NÚT TRÔI NỔI */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 z-[110]">
              <button
                onClick={async (e) => {
                  e.preventDefault();
                  try {
                    await API.post('/users/wishlist', { productId: product._id });
                    setIsLiked(!isLiked);
                  } catch (err) {
                    alert(err.response?.data?.msg || "Lỗi server! Không thể thêm vào yêu thích.");
                  }
                }}
                className="bg-white/90 backdrop-blur p-2 rounded-full shadow-md transition-all hover:scale-110 group/btn"
                title="Thêm vào yêu thích"
              >
                <Heart size={18} className={`transition-colors ${isLiked ? 'fill-red-600 text-red-600' : 'text-gray-600 group-hover/btn:text-red-600'}`} />
              </button>

              <button
                onClick={(e) => { e.preventDefault(); setIsFlipped(true); }}
                className="bg-white/90 backdrop-blur p-2 rounded-full text-gray-600 hover:text-white hover:bg-black shadow-md transition-all hover:scale-110"
                title="Xem thông số kỹ thuật"
              >
                <Eye size={18} />
              </button>
            </div>
          </div>

          {/* Khu vực Thông tin cơ bản */}
          <div className="p-4 flex flex-col flex-grow justify-between">
            <div>
              <div className="text-[10px] font-black uppercase text-gray-400 mb-1 tracking-wider">
                {product.category || 'Gậy Bi A'}
              </div>
              <Link to={`/product/${product._id}`}>
                <h3 className="text-[15px] font-black text-gray-800 hover:text-red-600 transition-colors line-clamp-2 leading-tight">
                  {product.name}
                </h3>
              </Link>
            </div>

            {/* Giá và Nút thêm giỏ hàng */}
            <div className="mt-2 flex items-center justify-between">
              <span className="text-lg font-black text-red-600">
                {product.price && product.price > 0
                  ? `${product.price.toLocaleString('vi-VN')}đ`
                  : 'Liên hệ'}
              </span>
              <button
                onClick={() => addToCart(product)}
                className="bg-red-600 hover:bg-black text-white p-2.5 rounded-xl transition-colors shadow-sm hover:shadow-md hover:-translate-y-1 transform duration-200"
                title="Thêm vào giỏ"
              >
                <ShoppingCart size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* ==========================================
            MẶT SAU (BACK) - THÔNG SỐ CHI TIẾT
        ========================================== */}
        <div className="absolute inset-0 w-full h-full bg-gray-900 text-white rounded-2xl shadow-xl overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col p-5 border-2 border-red-600">

          {/* Header mặt sau */}
          <div className="flex justify-between items-start mb-4 border-b border-gray-700 pb-3">
            <h3 className="font-black text-red-500 uppercase text-base line-clamp-2 leading-tight flex-1 pr-2">
              {product.name}
            </h3>
            {/* Nút quay lại mặt trước */}
            <button
              onClick={(e) => { e.preventDefault(); setIsFlipped(false); }}
              className="text-gray-400 hover:text-white transition-colors bg-gray-800 p-2 rounded-full hover:bg-red-600 flex-shrink-0"
              title="Quay lại"
            >
              <RotateCcw size={16} />
            </button>
          </div>

          {/* Chi tiết sản phẩm */}
          <div className="flex-1 overflow-y-auto space-y-4 text-sm scrollbar-thin scrollbar-thumb-red-600 scrollbar-track-gray-800 pr-2">

            <div>
              <span className="text-gray-400 font-bold block text-[10px] uppercase mb-1 tracking-wider">Thương hiệu</span>
              <span className="font-black text-white bg-red-600 px-2 py-1 rounded text-xs uppercase shadow-sm">
                {product.brand || 'X-Billiard'}
              </span>
            </div>

            <div>
              <span className="text-gray-400 font-bold block text-[10px] uppercase mb-1 tracking-wider">Công nghệ cấu thành</span>
              <p className="text-gray-200 font-medium leading-relaxed bg-gray-800 p-2 rounded-lg text-xs">
                {product.technology || 'Đang cập nhật công nghệ và chất liệu cấu thành sản phẩm...'}
              </p>
            </div>

            <div>
              <span className="text-gray-400 font-bold block text-[10px] uppercase mb-1 tracking-wider">Đặc điểm nổi bật</span>
              <p className="text-gray-300 text-[11px] line-clamp-4">
                {product.description || 'Sản phẩm bi-a chất lượng cao, độ phân bổ trọng lượng hoàn hảo, bảo hành trọn đời tại hệ thống X-Billiard.'}
              </p>
            </div>

          </div>

          {/* Nút xem full trang chi tiết */}
          <Link
            to={`/product/${product._id}`}
            className="mt-4 w-full bg-red-600 text-white font-black py-2.5 rounded-lg uppercase text-xs hover:bg-white hover:text-red-600 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(220,38,38,0.4)]"
          >
            <Info size={16} /> Trang chi tiết
          </Link>

        </div>

      </div>
    </div>
  );
};

export default ProductCard;