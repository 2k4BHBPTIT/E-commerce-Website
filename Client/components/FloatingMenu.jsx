// src/components/FloatingMenu.jsx
import { MessageCircle, X, PhoneCall, Facebook, Music } from 'lucide-react';

const FloatingMenu = () => {
  return (
    // Đã thay đổi bottom-6 thành bottom-16 để đẩy menu lên cao hơn
    <div className="fixed bottom-32 right-6 z-[999] group">
      
      {/* Khung chứa relative để các nút con xuất phát từ đúng tâm của nút đỏ */}
      <div className="relative w-14 h-14 flex items-center justify-center">

        {/* NÚT 4: TIKTOK (Bắn thẳng sang Trái - Góc 180 độ) */}
        <a 
          href="https://tiktok.com" 
          target="_blank" 
          rel="noreferrer"
          className="absolute w-12 h-12 bg-black text-white rounded-full flex items-center justify-center opacity-0 scale-50 transition-all duration-300 ease-out delay-[200ms] group-hover:opacity-100 group-hover:scale-100 group-hover:-translate-x-[110px] group-hover:translate-y-0 hover:bg-gray-800 shadow-lg shadow-black/30"
          title="TikTok"
        >
          <Music size={20} />
        </a>

        {/* NÚT 3: FACEBOOK (Bắn chéo Trái Dưới - Góc 150 độ) */}
        <a 
          href="https://www.facebook.com/bui.huy.bich.2025" 
          target="_blank" 
          rel="noreferrer"
          className="absolute w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center opacity-0 scale-50 transition-all duration-300 ease-out delay-[150ms] group-hover:opacity-100 group-hover:scale-100 group-hover:-translate-x-[95px] group-hover:-translate-y-[55px] hover:bg-blue-700 shadow-lg shadow-blue-600/30"
          title="Facebook"
        >
          <Facebook size={20} />
        </a>

        {/* NÚT 2: ZALO (Bắn chéo Trái Trên - Góc 120 độ) */}
        <a 
          href="https://zalo.me/0836204777" 
          target="_blank" 
          rel="noreferrer"
          className="absolute w-12 h-12 bg-[#0068FF] text-white rounded-full flex items-center justify-center opacity-0 scale-50 transition-all duration-300 ease-out delay-[100ms] group-hover:opacity-100 group-hover:scale-100 group-hover:-translate-x-[55px] group-hover:-translate-y-[95px] hover:bg-blue-500 shadow-lg shadow-blue-400/30 font-black text-[11px] tracking-wider"
          title="Zalo"
        >
          Zalo
        </a>

        {/* NÚT 1: HOTLINE (Bắn thẳng Lên trên - Góc 90 độ) */}
        <a 
          href="tel:0836204777" 
          className="absolute w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center opacity-0 scale-50 transition-all duration-300 ease-out delay-[50ms] group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 group-hover:-translate-y-[110px] hover:bg-green-600 shadow-lg shadow-green-500/30"
          title="Hotline"
        >
          <PhoneCall size={20} className="animate-pulse" />
        </a>

        {/* NÚT CHÍNH (MAIN BUTTON) */}
        <button className="relative w-14 h-14 bg-red-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-red-600/40 transition-transform duration-300 group-hover:scale-110 z-10">
          
          <span className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-30 group-hover:hidden"></span>
          
          <MessageCircle size={28} className="absolute transition-all duration-300 transform group-hover:rotate-180 group-hover:opacity-0 group-hover:scale-50" />
          
          <X size={28} className="absolute transition-all duration-300 transform -rotate-180 opacity-0 scale-50 group-hover:rotate-0 group-hover:opacity-100 group-hover:scale-100" />
        
        </button>

      </div>
    </div>
  );
};

export default FloatingMenu;