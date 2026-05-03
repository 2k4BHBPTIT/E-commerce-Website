import { CheckCircle, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-xb-dark text-white pt-10 pb-6 border-t-[6px] border-xb-red mt-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Phần 1: Chính sách & Liên hệ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 border-b border-red-800 pb-8">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
             <h2 className="text-2xl font-bold italic mb-2">X-BILLIARD</h2>
             <p className="text-sm text-gray-200">Xbilliard mang đến những sản phẩm, phụ kiện gậy bi-a cam kết chính hãng có bảo hành.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">CHÍNH SÁCH</h3>
            <ul className="space-y-2 text-sm text-gray-200">
              <li className="flex items-center gap-2"><CheckCircle size={16} /> Chính sách bảo hành</li>
              <li className="flex items-center gap-2"><CheckCircle size={16} /> Chính sách mua hàng</li>
              <li className="flex items-center gap-2"><CheckCircle size={16} /> Chính sách thanh toán</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">LIÊN HỆ</h3>
            <div className="flex items-start gap-2 mb-4 text-sm text-gray-200">
              <Phone size={20} className="mt-1" />
              <div>
                <p>Tư vấn miễn phí 24/7</p>
                <p className="font-bold text-lg">0836204777</p>
              </div>
            </div>
            {/* Icons mạng xã hội có thể thêm vào đây */}
          </div>
        </div>

        {/* Phần 2: Địa chỉ các chi nhánh */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm text-gray-200">
          <div>
            <h4 className="font-bold text-white mb-2">HÀ NỘI</h4>
            <p className="flex items-start gap-1"><MapPin size={16} className="mt-1 flex-shrink-0" /> CS1: TT5. 1.5 KĐT mới Đại Kim, Hoàng Mai</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-2">HÀ NỘI</h4>
            <p className="flex items-start gap-1"><MapPin size={16} className="mt-1 flex-shrink-0" /> CS2: 8/291 Ngô Xuân Quảng, Trâu Quỳ, Gia Lâm</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-2">HỒ CHÍ MINH</h4>
            <p className="flex items-start gap-1"><MapPin size={16} className="mt-1 flex-shrink-0" /> 149/8 Bành Văn Trân, Phường 7, Tân Bình</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-2">BẮC NINH</h4>
            <p className="flex items-start gap-1"><MapPin size={16} className="mt-1 flex-shrink-0" /> Hồ đôi (Đường Chu Văn Nghị), Thị trấn Chờ, Yên Phong</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;