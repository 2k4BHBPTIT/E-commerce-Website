// src/pages/AboutClub.jsx
import { Trophy, Coffee, Star, CalendarDays, CheckCircle, PhoneCall } from 'lucide-react';

const AboutClub = () => {
  return (
    <div className="bg-gray-50 font-sans">
      
      {/* 1. HERO BANNER - KHÔNG GIAN CLB */}
      <div 
        className="relative h-[60vh] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1599566219227-2efe0c9b7f5f?q=80&w=2070&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-wider">
            X-BILLIARD <span className="text-red-600">CLUB</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 font-bold max-w-2xl mx-auto mb-8">
            Không gian giải trí đỉnh cao - Tiêu chuẩn thi đấu quốc tế. Nơi đam mê bida hội tụ!
          </p>
          <a href="#booking" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-black uppercase transition-transform hover:scale-105">
            <CalendarDays size={20} /> Đặt Bàn Ngay
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-24">

        {/* 2. TRANG THIẾT BỊ ĐỈNH CAO */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black uppercase text-gray-900 flex items-center justify-center gap-3">
              <Trophy className="text-red-600" size={32} /> Trang Thiết Bị Tiêu Chuẩn
            </h2>
            <div className="w-24 h-1 bg-red-600 mx-auto mt-4"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group">
              <div className="h-56 overflow-hidden">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4KVa5YtJtjEBk8jVtPDmBFHjlXvu31fUdkA&s" alt="Bàn thi đấu" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-black text-gray-800 uppercase mb-2">Bàn thi đấu Aileex / Min</h3>
                <p className="text-gray-600 font-bold text-sm">100% bàn mới, nỉ thi đấu cao cấp, sưởi nhiệt tiêu chuẩn giúp bi chạy mượt mà, chính xác.</p>
              </div>
            </div>
            {/* Card 2 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group">
              <div className="h-56 overflow-hidden">
                <img src="data:image/jpeg;base64,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" alt="Cơ bida" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-black text-gray-800 uppercase mb-2">Cơ CLB chất lượng cao</h3>
                <p className="text-gray-600 font-bold text-sm">Cơ phủ Carbon và cơ mộc cao cấp được bảo dưỡng, thay tẩy định kỳ hàng tuần.</p>
              </div>
            </div>
            {/* Card 3 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group">
              <div className="h-56 overflow-hidden">
                <img src="https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSGDif3QbHEWJEDcrJSuniSauPz2AL1YZGybUnGME0XCNHo8yY_5OsZDToc7qbW1Y7YkMgTVll6X6t5LbSf-uAuoCKVVkEt0NXqqyqj1e_5V-BOlHWiiGZW&usqp=CAc" alt="Bi Aramith" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-black text-gray-800 uppercase mb-2">Bi Aramith Pro TV</h3>
                <p className="text-gray-600 font-bold text-sm">Sử dụng 100% bóng Aramith Bỉ siêu bóng, máy đánh bóng bi hoạt động liên tục 24/7.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. DỊCH VỤ F&B (ĐỒ ĂN/THỨC UỐNG/COMBO) */}
        <section className="bg-gray-900 text-white rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black uppercase flex items-center justify-center gap-3">
              <Coffee className="text-red-500" size={32} /> Menu Giải Khát & Năng Lượng
            </h2>
            <div className="w-24 h-1 bg-red-500 mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Cột Menu */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-black text-red-500 uppercase border-b border-gray-700 pb-2 mb-4">Thức uống tươi mát</h3>
                <ul className="space-y-3 font-bold text-gray-300">
                  <li className="flex justify-between"><span>Cà phê (Đen/Sữa/Muối)</span> <span>25.000đ - 35.000đ</span></li>
                  <li className="flex justify-between"><span>Trà đào cam sả / Trà vải</span> <span>35.000đ</span></li>
                  <li className="flex justify-between"><span>Nước ép trái cây tươi</span> <span>40.000đ</span></li>
                  <li className="flex justify-between"><span>Bia / Nước ngọt các loại</span> <span>Từ 20.000đ</span></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-black text-red-500 uppercase border-b border-gray-700 pb-2 mb-4">Đồ ăn nhẹ</h3>
                <ul className="space-y-3 font-bold text-gray-300">
                  <li className="flex justify-between"><span>Mì xào bò / Trứng xúc xích</span> <span>45.000đ - 55.000đ</span></li>
                  <li className="flex justify-between"><span>Cơm rang dưa bò</span> <span>60.000đ</span></li>
                  <li className="flex justify-between"><span>Khô gà / Khô bò vắt chanh</span> <span>50.000đ</span></li>
                  <li className="flex justify-between"><span>Trái cây đĩa</span> <span>80.000đ</span></li>
                </ul>
              </div>
            </div>

            {/* Cột Combo */}
            <div className="bg-black/50 p-6 md:p-8 rounded-2xl border border-gray-800">
              <h3 className="text-2xl font-black text-yellow-500 uppercase mb-6 text-center">🔥 Combo Siêu Tiết Kiệm</h3>
              <div className="space-y-4">
                <div className="bg-gray-800 p-4 rounded-xl border-l-4 border-yellow-500">
                  <h4 className="font-black text-lg text-white uppercase">Combo Solo (2 người)</h4>
                  <p className="text-sm text-gray-400 mt-1">2 Nước tùy chọn + 1 Đĩa trái cây nhỏ + Tặng 30 phút tiền bàn.</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-xl border-l-4 border-red-500">
                  <h4 className="font-black text-lg text-white uppercase">Combo Team (4 người)</h4>
                  <p className="text-sm text-gray-400 mt-1">4 Nước tùy chọn + 2 Mì xào + 1 Đĩa trái cây + Tặng 1h tiền bàn.</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-xl border-l-4 border-blue-500">
                  <h4 className="font-black text-lg text-white uppercase">Combo Night (Sau 22h)</h4>
                  <p className="text-sm text-gray-400 mt-1">Giảm 20% tổng bill (Bao gồm cả tiền giờ và đồ ăn uống).</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. THẺ THÀNH VIÊN */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black uppercase text-gray-900 flex items-center justify-center gap-3">
              <Star className="text-red-600" size={32} /> Đặc quyền Thành viên
            </h2>
            <div className="w-24 h-1 bg-red-600 mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Thẻ Silver */}
            <div className="bg-gradient-to-br from-gray-100 to-gray-300 p-8 rounded-2xl shadow-lg relative overflow-hidden border border-gray-300 transform transition-transform hover:-translate-y-2">
              <div className="absolute top-0 right-0 bg-gray-500 text-white font-black text-xs px-4 py-1 rounded-bl-lg uppercase">Phổ biến</div>
              <h3 className="text-2xl font-black text-gray-800 uppercase mb-2">Thẻ Silver</h3>
              <p className="text-gray-600 font-bold mb-6">Tích lũy tổng nạp từ 1.000.000đ</p>
              <ul className="space-y-3 font-bold text-gray-700 text-sm">
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-gray-600"/> Giảm 5% tiền giờ chơi.</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-gray-600"/> Tặng 1 nước suối/trà đá mỗi lần chơi.</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-gray-600"/> Giữ gậy cá nhân tại tủ locker CLB.</li>
              </ul>
            </div>

            {/* Thẻ VIP Gold */}
            <div className="bg-gradient-to-br from-yellow-100 via-yellow-300 to-yellow-500 p-8 rounded-2xl shadow-lg relative overflow-hidden transform transition-transform hover:-translate-y-2">
              <div className="absolute top-0 right-0 bg-red-600 text-white font-black text-xs px-4 py-1 rounded-bl-lg uppercase">Khuyên dùng</div>
              <h3 className="text-2xl font-black text-gray-900 uppercase mb-2">Thẻ VIP Gold</h3>
              <p className="text-gray-800 font-bold mb-6">Tích lũy tổng nạp từ 5.000.000đ</p>
              <ul className="space-y-3 font-bold text-gray-900 text-sm">
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-red-600"/> Giảm 15% tiền giờ chơi vĩnh viễn.</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-red-600"/> Giảm 10% toàn bộ Menu F&B.</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-red-600"/> Tủ locker VIP riêng biệt.</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-red-600"/> Ưu tiên đặt bàn vào giờ cao điểm.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 5. FORM ĐẶT BÀN */}
        <section id="booking" className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-black uppercase text-gray-900 mb-4">Bạn đã sẵn sàng?</h2>
            <p className="text-gray-600 font-bold mb-6">
              Đừng để mất hứng vì hết bàn! Hãy liên hệ ngay với chúng tôi để giữ chỗ và có những trải nghiệm tuyệt vời nhất cùng anh em.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
              <a href="tel:0836204777" className="flex items-center gap-2 bg-red-600 hover:bg-black text-white px-8 py-4 rounded-xl font-black uppercase transition-colors w-full sm:w-auto justify-center shadow-lg shadow-red-600/30">
                <PhoneCall size={24} /> Gọi Hotline: 0836 204 777
              </a>
            </div>
            <p className="text-xs text-gray-400 font-bold mt-4">* Lưu ý: Vui lòng đặt trước ít nhất 1 giờ vào các khung giờ vàng (19h - 22h).</p>
          </div>
          
          <div className="flex-1 w-full relative">
            {/* Ảnh trang trí góc đặt bàn */}
            <div className="absolute inset-0 bg-red-600 transform translate-x-4 translate-y-4 rounded-2xl hidden md:block"></div>
            <img src="https://images.unsplash.com/photo-1510006935688-692a792ac19a?q=80&w=2073&auto=format&fit=crop" alt="Đặt bàn bida" className="relative z-10 w-full h-80 object-cover rounded-2xl shadow-xl" />
          </div>
        </section>

      </div>
    </div>
  );
};

export default AboutClub;