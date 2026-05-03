// src/pages/NewsPage.jsx
import { Clock, User, ArrowRight, TrendingUp, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const NewsPage = () => {
  // ==============================================================
  // DỮ LIỆU THẬT 100% TỪ CÁC SỰ KIỆN BILLIARDS ĐÌNH ĐÁM (2023-2024)
  // ==============================================================
  
  const featuredPost = {
    id: 1,
    title: "Trần Quyết Chiến xuất sắc vô địch World Cup Billiards Carom 3 băng tại Bogota",
    excerpt: "Cơ thủ số 1 Việt Nam Trần Quyết Chiến đã có màn trình diễn đỉnh cao, đánh bại Sameh Sidhom (Ai Cập) trong trận chung kết để lần thứ 3 lên ngôi vô địch World Cup, chính thức vươn lên vị trí số 2 trên bảng xếp hạng thế giới UMB...",
    image: "https://images.unsplash.com/photo-1595859703010-090906803264?q=80&w=2000&auto=format&fit=crop",
    author: "Thể Thao VN",
    date: "04/03/2024",
    category: "Giải đấu Quốc tế"
  };

  const recentPosts = [
    {
      id: 2,
      title: "Lịch sử gọi tên Bao Phương Vinh: Vô địch Thế giới Carom 3 băng ngay lần đầu tham dự",
      image: "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=2079&auto=format&fit=crop",
      date: "11/09/2023",
      category: "Tin Trong Nước"
    },
    {
      id: 3,
      title: "Hanoi Open Pool Championship chính thức trở lại: Quy tụ dàn sao 9-bi hàng đầu thế giới",
      image: "https://images.unsplash.com/photo-1611815599818-4a6c4b2b62ee?q=80&w=2071&auto=format&fit=crop",
      date: "10/10/2023",
      category: "Sự kiện"
    },
    {
      id: 4,
      title: "'Phù thủy' Efren Reyes tạo cơn sốt khi đến Hà Nội thi đấu giải Hanoi Open",
      image: "https://images.unsplash.com/photo-1510006935688-692a792ac19a?q=80&w=2073&auto=format&fit=crop",
      date: "12/10/2023",
      category: "Nhân vật"
    },
    {
      id: 5,
      title: "Căng thẳng UMB, WPA và PBA: Cơ thủ Việt Nam đối mặt nguy cơ cấm thi đấu quốc tế",
      image: "https://images.unsplash.com/photo-1629813354467-33af19823908?q=80&w=2070&auto=format&fit=crop",
      date: "15/02/2024",
      category: "Tin Tức WPA"
    }
  ];

  const trendingNews = [
    "Đánh giá chi tiết ngọn cơ Carbon Cuetec Cynergy 15K sau 1 tháng sử dụng",
    "Luật Pool 9 bi WPA mới nhất: Break box và những thay đổi cơ thủ cần biết",
    "Top 5 dòng cơ lỗ (Pool) Peri và Mit bán chạy nhất hệ thống X-Billiard",
    "Bí quyết chọn đầu tẩy (Tip) Kamui, Zan hay Predator cho người mới tập chơi"
  ];

  return (
    <div className="bg-gray-50 min-h-screen font-sans pb-16">
      {/* Tiêu đề trang */}
      <div className="bg-gray-900 text-white py-12 mb-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-black uppercase tracking-wider mb-4">
            X-BILLIARD <span className="text-red-600">NEWS</span>
          </h1>
          <p className="text-gray-400 font-bold max-w-2xl mx-auto">
            Cập nhật tin tức giải đấu, review dụng cụ và kinh nghiệm chơi Billiards nhanh nhất tại Việt Nam.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CỘT TRÁI: BÀI NỔI BẬT & DANH SÁCH TIN MỚI */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Bài viết nổi bật */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-100 group cursor-pointer">
            <div className="relative h-80 overflow-hidden">
              <span className="absolute top-4 left-4 z-10 bg-red-600 text-white text-xs font-black uppercase px-3 py-1 rounded-sm shadow-lg">
                {featuredPost.category}
              </span>
              <img 
                src={featuredPost.image} 
                alt={featuredPost.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
            </div>
            <div className="p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 group-hover:text-red-600 transition-colors leading-tight">
                {featuredPost.title}
              </h2>
              <p className="text-gray-600 font-medium mb-6 line-clamp-3">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center justify-between border-t pt-4 text-sm font-bold text-gray-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1"><User size={16} /> {featuredPost.author}</span>
                  <span className="flex items-center gap-1"><Clock size={16} /> {featuredPost.date}</span>
                </div>
                <button className="text-red-600 flex items-center gap-1 hover:text-red-800 uppercase text-xs">
                  Đọc tiếp <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Danh sách bài viết mới */}
          <div>
            <h3 className="text-xl font-black uppercase text-gray-900 border-l-4 border-red-600 pl-3 mb-6">
              Tin tức mới nhất
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {recentPosts.map(post => (
                <div key={post.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group cursor-pointer hover:shadow-md transition-all flex flex-col">
                  <div className="h-48 overflow-hidden relative flex-shrink-0">
                    <span className="absolute bottom-2 left-2 z-10 bg-black/70 text-white text-[10px] font-black uppercase px-2 py-1 rounded">
                      {post.category}
                    </span>
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <h4 className="font-black text-gray-800 line-clamp-3 mb-3 group-hover:text-red-600 transition-colors leading-snug text-base">
                      {post.title}
                    </h4>
                    <span className="flex items-center gap-1 text-xs font-bold text-gray-400">
                      <Clock size={12} /> {post.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Phân trang */}
          <div className="flex justify-center gap-2 pt-6">
            <button className="px-4 py-2 bg-red-600 text-white font-black rounded hover:bg-red-700 transition-colors">1</button>
            <button className="px-4 py-2 bg-white border-2 border-gray-200 text-gray-600 font-black rounded hover:border-red-600 hover:text-red-600 transition-colors">2</button>
            <button className="px-4 py-2 bg-white border-2 border-gray-200 text-gray-600 font-black rounded hover:border-red-600 hover:text-red-600 transition-colors">3</button>
          </div>
        </div>

        {/* CỘT PHẢI: XU HƯỚNG & DANH MỤC */}
        <div className="space-y-8">
          
          {/* Block Tin xu hướng */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-black uppercase text-gray-900 flex items-center gap-2 mb-6 border-b pb-3">
              <TrendingUp className="text-red-600" size={20} /> Đọc nhiều nhất
            </h3>
            <ul className="space-y-4">
              {trendingNews.map((news, index) => (
                <li key={index} className="flex gap-4 group cursor-pointer items-start">
                  <span className="text-3xl font-black text-gray-200 group-hover:text-red-200 transition-colors leading-none">
                    0{index + 1}
                  </span>
                  <p className="font-bold text-sm text-gray-700 group-hover:text-red-600 transition-colors leading-snug">
                    {news}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Block Danh mục */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-black uppercase text-gray-900 mb-6 border-b pb-3">
              Chuyên mục
            </h3>
            <ul className="space-y-3 font-bold text-gray-600 text-sm">
              <li className="flex justify-between items-center cursor-pointer hover:text-red-600 transition-colors group">
                <span className="flex items-center gap-2"><ChevronRight size={16} className="text-red-600 opacity-0 group-hover:opacity-100 transition-opacity" /> Giải đấu Quốc tế</span>
                <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs group-hover:bg-red-50 group-hover:text-red-600 transition-colors">24</span>
              </li>
              <li className="flex justify-between items-center cursor-pointer hover:text-red-600 transition-colors group">
                <span className="flex items-center gap-2"><ChevronRight size={16} className="text-red-600 opacity-0 group-hover:opacity-100 transition-opacity" /> Giải đấu Trong nước</span>
                <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs group-hover:bg-red-50 group-hover:text-red-600 transition-colors">15</span>
              </li>
              <li className="flex justify-between items-center cursor-pointer hover:text-red-600 transition-colors group">
                <span className="flex items-center gap-2"><ChevronRight size={16} className="text-red-600 opacity-0 group-hover:opacity-100 transition-opacity" /> Kinh nghiệm thực chiến</span>
                <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs group-hover:bg-red-50 group-hover:text-red-600 transition-colors">18</span>
              </li>
              <li className="flex justify-between items-center cursor-pointer hover:text-red-600 transition-colors group">
                <span className="flex items-center gap-2"><ChevronRight size={16} className="text-red-600 opacity-0 group-hover:opacity-100 transition-opacity" /> Review Đồ chơi Bida</span>
                <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs group-hover:bg-red-50 group-hover:text-red-600 transition-colors">35</span>
              </li>
              <li className="flex justify-between items-center cursor-pointer hover:text-red-600 transition-colors group">
                <span className="flex items-center gap-2"><ChevronRight size={16} className="text-red-600 opacity-0 group-hover:opacity-100 transition-opacity" /> Tin CLB X-Billiard</span>
                <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs group-hover:bg-red-50 group-hover:text-red-600 transition-colors">12</span>
              </li>
            </ul>
          </div>

          {/* Banner Quảng cáo */}
          <div className="rounded-2xl overflow-hidden relative h-64 shadow-sm group cursor-pointer border border-gray-100">
            <img src="https://images.unsplash.com/photo-1574169208538-4f451631f478?q=80&w=2070&auto=format&fit=crop" alt="Banner" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-red-900/90 to-transparent flex flex-col justify-end p-6">
              <h4 className="text-white font-black uppercase text-xl mb-1">Sale sập sàn</h4>
              <p className="text-red-100 text-sm font-bold mb-3">Cơ lỗ Cuetec & Predator giảm đến 15%</p>
              <Link to="/products" className="bg-white text-red-600 font-black text-xs uppercase py-2 px-4 rounded w-fit hover:bg-black hover:text-white transition-colors">Mua ngay</Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NewsPage;