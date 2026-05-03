// src/components/Header.jsx
import { useState, useEffect, useContext } from 'react'; // ĐÃ THÊM: useEffect
import { Phone, ShoppingCart, Home, Menu, X, Search, User, Wallet, Ticket, Gift, ShoppingBag, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios'; // ĐÃ THÊM: Import API để gọi Backend

const Header = ({ searchTerm, setSearchTerm, handleSearch }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setIsCartOpen, cartItems } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // ======================================================
  // LOGIC KÉO CẤU HÌNH (HOTLINE) TỪ BACKEND
  // ======================================================
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await API.get('/settings');
        setSettings(res.data);
      } catch (err) {
        console.error("Lỗi tải cài đặt:", err);
      }
    };
    fetchSettings();
  }, []);

  const handleMenuSearch = (brand) => {
    setSearchTerm(brand);
    // Chỉ chuyển hướng sang trang search, không gọi fetchProducts thủ công nữa
    navigate(`/search?q=${encodeURIComponent(brand)}`);
  };

  // Hàm kiểm tra xem user có phải admin không (hỗ trợ cả 2 định dạng phổ biến)
  const isUserAdmin = user?.role === 'admin' || user?.isAdmin === true;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-[100]">
      {/* 1. THANH TRÊN CÙNG: Hotline & Tài khoản (Ẩn trên mobile) */}
      <div className="hidden md:block bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-1 flex justify-between items-center text-xs font-sans">
          <div className="flex items-center gap-4 text-gray-600">
            <span className="flex items-center gap-1">
              <Phone size={14} className="text-red-600" /> 
              Hotline: {settings?.hotline || 'Đang cập nhật...'}
            </span>
            <span>Hệ thống cửa hàng toàn quốc</span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              // Bọc toàn bộ khu vực User vào một group relative để làm menu thả xuống
              <div className="relative group cursor-pointer py-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-sans border border-red-200">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                </div>

                {/* DROPDOWN MENU - VÍ NGƯỜI DÙNG */}
                <div className="absolute top-full right-0 mt-1 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[120] transform origin-top-right scale-95 group-hover:scale-100 p-4">

                  {/* Tiêu đề Ví */}
                  <div className="border-b border-gray-100 pb-3 mb-3 flex items-center justify-between">
                    <span className="font-black text-lg text-gray-800 flex items-center gap-2">
                      <Wallet size={20} className="text-red-600" /> Ví X-Billiard
                    </span>
                    <span className="text-[10px] bg-red-100 text-red-600 px-2 py-1 rounded font-black uppercase tracking-wider">
                      Thành viên
                    </span>
                  </div>

                  {/* Số dư & Nút Nạp tiền */}
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-gray-500 uppercase">Số dư khả dụng</span>
                      {/* Tạm thời dùng toán tử ?. để tránh lỗi nếu DB chưa có trường này */}
                      <span className="text-lg font-black text-red-600">
                        {user.walletBalance ? user.walletBalance.toLocaleString('vi-VN') : '0'}đ
                      </span>
                    </div>
                    <button
                      onClick={() => navigate('/profile/deposit')}
                      className="w-full bg-red-600 hover:bg-black text-white font-black uppercase text-xs py-2 rounded transition-colors shadow-md"
                    >
                      + Nạp Tiền Ngay
                    </button>
                  </div>

                  {/* Các Menu Chức Năng */}
                  <ul className="space-y-1 text-sm font-bold text-gray-700">
                    <li>
                      <Link to="/profile/vouchers" className="flex items-center justify-between p-2 hover:bg-red-50 hover:text-red-600 rounded transition-colors">
                        <span className="flex items-center gap-2"><Ticket size={16} /> Kho Voucher</span>
                        <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">{user.vouchers?.length || 0}</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/vong-quay" className="flex items-center justify-between p-2 hover:bg-red-50 hover:text-red-600 rounded transition-colors">
                        <span className="flex items-center gap-2"><Gift size={16} /> Lượt quay may mắn</span>
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs">{user.luckySpins || 0}</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/profile/orders" className="flex items-center justify-between p-2 hover:bg-red-50 hover:text-red-600 rounded transition-colors">
                        <span className="flex items-center gap-2"><ShoppingBag size={16} /> Lịch sử mua hàng</span>
                      </Link>
                    </li>

                    <Link
                      to="/profile"
                      className="flex items-center gap-3 p-3 font-bold text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                    >
                      <i className="fas fa-user"></i> {/* Hoặc dùng Icon của bạn */}
                      Quản lý tài khoản
                    </Link>

                    {/* Link dành riêng cho Admin */}
                    {isUserAdmin && (
                      <li className="border-t border-gray-100 mt-2 pt-2">
                        <Link to="/admin" className="flex items-center gap-2 p-2 bg-gray-900 text-white rounded hover:bg-red-600 transition-colors">
                          <User size={16} /> Trang Quản Trị Admin
                        </Link>
                      </li>
                    )}
                  </ul>

                  {/* Nút Đăng Xuất */}
                  <div className="border-t border-gray-100 pt-2 mt-2">
                    <button onClick={logout} className="w-full text-left p-2 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded text-sm font-bold flex items-center gap-2 transition-colors">
                      <LogOut size={16} /> Đăng xuất
                    </button>
                  </div>

                </div>
              </div>
            ) : (
              <button onClick={() => navigate('/login')} className="hover:text-red-600 transition uppercase font-bold text-xs">
                Đăng nhập / Đăng ký
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. THANH CHÍNH: Logo, Search, Cart */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <button onClick={() => setIsMenuOpen(true)} className="md:hidden p-1 text-gray-700">
          <Menu size={28} />
        </button>

        <Link to="/" className="flex-shrink-0">
          <h1 className="text-2xl md:text-3xl text-red-600 font-black leading-none">X-BILLIARD</h1>
          <p className="text-[10px] text-red-600 font-bold tracking-tighter hidden md:block">BẢO HÀNH TRỌN ĐỜI</p>
        </Link>

        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl relative">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm bi-a"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border-2 border-red-600 rounded-full py-2 px-6 outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm font-bold"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-red-600 text-white p-1.5 rounded-full hover:bg-black transition-colors">
            <Search size={18} />
          </button>
        </form>

        <div className="flex items-center gap-3 md:gap-6">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-1 hover:text-red-600 transition-all"
          >
            <ShoppingCart size={26} className="text-gray-800" />
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold shadow-sm">
              {cartItems.length}
            </span>
          </button>

          <div className="md:hidden flex items-center gap-2">
            {user ? (
              <>
                {isUserAdmin && (
                  <Link to="/admin" className="text-[10px] bg-red-600 text-white font-black px-2 py-1 rounded">
                    ADMIN
                  </Link>
                )}
                <button onClick={logout} className="p-1 text-gray-800 hover:text-red-600">
                  <LogOut size={22} />
                </button>
              </>
            ) : (
              <button className="p-1 hover:text-red-600 transition-all" onClick={() => navigate('/login')}>
                <User size={26} className="text-gray-800" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* THANH TÌM KIẾM CHO MOBILE */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg py-2 px-4 outline-none focus:border-red-600 text-sm"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={20} />
          </button>
        </form>
      </div>

      {/* 3. THANH DANH MỤC DESKTOP */}
      <nav className="hidden md:block bg-red-700 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center text-xs font-black uppercase">
            <li><Link to="/" className="block py-3 px-4 hover:bg-black transition"><Home size={18} /></Link></li>
            <li className="relative group">
              <Link to="/category/gay-bi-a" className="block py-3 px-4 hover:bg-black transition border-r border-red-800">Gậy Bi A</Link>
              <ul className="absolute left-0 top-full bg-white text-gray-800 w-48 shadow-xl hidden group-hover:block z-[110] border-t-2 border-red-600">
                {['Allin', 'Wolf', 'Fury', 'ShengDao', 'Peri'].map(item => (
                  <li key={item}>
                    <button
                      onClick={() => handleMenuSearch(item)}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 hover:text-red-600 border-b border-gray-50 uppercase font-bold text-[10px]"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </li>
            <li><Link to="/category/phu-kien" className="block py-3 px-4 hover:bg-black transition border-r border-red-800">Phụ Kiện</Link></li>
            <li><Link to="/category/dich-vu" className="block py-3 px-4 hover:bg-black transition border-r border-red-800">Dịch Vụ</Link></li>
            <li><Link to="/ve-chung-toi" className="block py-3 px-4 hover:bg-black transition">Về CLB</Link></li>
            <li><Link to="/tin-tuc" className="block py-3 px-4 hover:bg-black transition">Tin Tức</Link></li>
            <Link to="/vong-quay" className="block py-3 px-4 text-yellow-300 hover:text-white hover:bg-black transition font-black animate-pulse">
              🎁 QUAY THƯỞNG
            </Link>
          </ul>
        </div>
      </nav>

      {/* 4. SIDEBAR MENU CHO MOBILE */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-[200] transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className={`fixed inset-y-0 left-0 w-72 bg-white shadow-2xl transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-4 flex justify-between items-center border-b bg-red-600 text-white">
            <span className="font-black">DANH MỤC MENU</span>
            <button onClick={() => setIsMenuOpen(false)}><X size={24} /></button>
          </div>
          <ul className="p-4 space-y-4 font-bold text-gray-800 uppercase text-sm">
            {isUserAdmin && (
              <li className="border-b pb-2">
                <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 text-600">
                  › Quản trị Admin
                </Link>
              </li>
            )}
            <li className="border-b pb-2"><Link to="/profile" onClick={() => setIsMenuOpen(false)}>Tài khoản</Link></li> 
            <li><Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 text-red-600"><Home size={18} /> Trang chủ</Link></li>
            <li className="border-b pb-2"><Link to="/category/gay-bi-a" onClick={() => setIsMenuOpen(false)}>Gậy Bi A</Link></li>
            <li className="border-b pb-2"><Link to="/category/phu-kien" onClick={() => setIsMenuOpen(false)}>Phụ Kiện</Link></li>
            <li className="border-b pb-2"><Link to="/category/dich-vu" onClick={() => setIsMenuOpen(false)}>Dịch Vụ</Link></li>
            <li><Link to="/ve-chung-toi" className="block py-3 px-4 hover:bg-black transition">Về CLB</Link></li>
            <li><Link to="/tin-tuc" className="block py-3 px-4 hover:bg-black transition">Tin Tức</Link></li>
            <li><Link to="/lien-he" onClick={() => setIsMenuOpen(false)}>Liên Hệ</Link></li>
            <Link to="/vong-quay" className="block py-3 px-4 text-yellow-300 hover:text-white hover:bg-black transition font-black animate-pulse">
              🎁 QUAY THƯỞNG
            </Link>
          </ul>
        </div>
      </div>

    </header>
  );
};

export default Header;