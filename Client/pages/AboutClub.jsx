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
                <img src="https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=2079&auto=format&fit=crop" alt="Cơ bida" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-black text-gray-800 uppercase mb-2">Cơ CLB chất lượng cao</h3>
                <p className="text-gray-600 font-bold text-sm">Cơ phủ Carbon và cơ mộc cao cấp được bảo dưỡng, thay tẩy định kỳ hàng tuần.</p>
              </div>
            </div>
            {/* Card 3 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group">
              <div className="h-56 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1611815599818-4a6c4b2b62ee?q=80&w=2071&auto=format&fit=crop" alt="Bi Aramith" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
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