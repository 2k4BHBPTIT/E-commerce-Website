import { useEffect, useState } from 'react';
import API from '../api/axios';
import BannerSlider from '../components/BannerSlider';
import DealProductCard from '../components/DealProductCard';
import ProductCard from '../components/ProductCard'; 
import CountdownTimer from '../components/CountdownTimer';
import VideoGallery from '../components/VideoGallery';

const FlameIcon = ({ className }) => (
  <svg viewBox="0 0 457.14 457.14" className={className} fill="currentColor">
    <path d="M127.125,441.258c0,0-12.871-70.218,17.406-118.94c0,0-46.126,24.188-46.126,81.166s29.43,60.672,29.43,60.672 C51.049,438.452,1.31,335.78,1.31,228.172C1.31,102.155,103.465,0,229.482,0s228.172,102.155,228.172,228.172 c0,107.608-49.739,210.28-126.525,235.986c0,0,29.43-3.694,29.43-60.672s-46.126-81.166-46.126-81.166 c30.276,48.723,17.406,118.94,17.406,118.94s13.313-14.776,13.313-72.115c0-57.34-60.709-106.326-60.709-106.326 s13.313,44.776,13.313,101.442s-13.313,67.671-13.313,67.671s-12.871-70.218,17.406-118.94 c0,0-46.126,24.188-46.126,81.166s29.43,60.672,29.43,60.672c-29.43,2.705-72.126-25.795-72.126-72.115 c0-46.32,60.709-106.326,60.709-106.326s-13.313,44.776-13.313,101.442S127.125,441.258,127.125,441.258z"/>
  </svg>
);

const HomePage = ({ products, searchTerm, dealProducts }) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  
  // STATE CMS (Chứa cấu hình dàn trang từ Backend)
  const [homeConfig, setHomeConfig] = useState({
    layoutOrder: ['banner', 'flashSale', 'featured', 'video', 'brands'],
    sectionVisibility: { banner: true, flashSale: true, featured: true, video: true, brands: true }
  });

  const brands = [
    { name: 'Allin Cue', logo: 'https://xbilliard.vn/wp-content/uploads/2024/11/Allin-Cue.png' },
    { name: 'Peri', logo: 'https://xbilliard.vn/wp-content/uploads/2024/11/Peri.png' },
    { name: 'Rhino', logo: 'https://xbilliard.vn/wp-content/uploads/2024/11/Rhino.png' },
    { name: 'Predator', logo: 'https://xbilliard.vn/wp-content/uploads/2023/06/predator.png' },
    { name: 'Fury', logo: 'https://xbilliard.vn/wp-content/uploads/2023/06/fury.png' },
    { name: 'Wolf', logo: 'https://xbilliard.vn/wp-content/uploads/2024/11/Wolf.png' },
    { name: 'Mit', logo: 'https://xbilliard.vn/wp-content/uploads/2023/06/mitcues.png' },
  ];

  useEffect(() => {
    // Gọi đồng thời cả API sản phẩm nổi bật VÀ cấu hình trang chủ
    const fetchData = async () => {
      try {
        const [resFeatured, resConfig] = await Promise.all([
          API.get('/products/get-featured'),
          API.get('/settings')
        ]);
        setFeaturedProducts(resFeatured.data);
        
        // Nếu DB đã có cấu hình CMS thì ghi đè vào state
        if (resConfig.data?.layoutOrder?.length > 0) {
          setHomeConfig({
            layoutOrder: resConfig.data.layoutOrder,
            sectionVisibility: resConfig.data.sectionVisibility
          });
        }
      } catch (error) { console.error("Lỗi tải trang chủ", error); }
    };
    fetchData();
  }, []);

  const displayedProducts = searchTerm ? products : featuredProducts;

  // ==============================================================
  // KHO CHỨA CÁC "BLOCK" ĐỂ CHUẨN BỊ RENDER DỰA TRÊN THỨ TỰ (CMS)
  // ==============================================================
  const PageSections = {
    // 1. KHỐI BANNER
    banner: (
      <BannerSlider key="banner" />
    ),

    // 2. KHỐI FLASH SALE
    flashSale: (
      <section key="flashSale" className="bg-white p-6 rounded-lg shadow-sm border-x-[12px] border-[#a01010] mt-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-gray-100 pb-4">
          <h2 className="text-2xl md:text-3xl font-mono text-[#a01010] uppercase flex items-center gap-2.5">
            <FlameIcon className="w-9 h-9 text-yellow-400 animate-[pulse_1s_ease-in-out_infinite]" />
            <span className="relative">FLASH SALE<span className="absolute -top-1 -right-3 text-yellow-400 font-black text-xs animate-pulse">⚡</span></span>
            <FlameIcon className="w-9 h-9 text-orange-600 animate-[pulse_1.5s_ease-in-out_infinite]" />
          </h2>
          <div className="flex items-center gap-4">
            <h3 className="text-xl md:text-2xl font-normal text-[#a01010] uppercase animate-pulse">Số Lượng Có Hạn</h3>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {dealProducts?.length > 0 ? dealProducts.map(item => <DealProductCard key={item._id} product={item} />) : <div className="col-span-full text-center py-10 font-bold text-gray-400">Vui lòng chờ giờ vàng...</div>}
        </div>
      </section>
    ),

    // 3. KHỐI SẢN PHẨM NỔI BẬT
    featured: (
      <section key="featured" className="mt-10">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl font-black text-red-600 uppercase border-l-4 border-red-600 pl-3">
            {searchTerm ? `Kết quả tìm kiếm: "${searchTerm}"` : "Sản phẩm nổi bật"}
          </h2>
          <div className="flex-1 h-[1px] bg-gray-200"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedProducts?.length > 0 ? displayedProducts.map(item => <ProductCard key={item._id} product={item} />) : <div className="col-span-full text-center py-10 font-bold text-gray-400">Không có sản phẩm...</div>}
        </div>
      </section>
    ),

    // 4. KHỐI VIDEO
    video: <div key="video" className="mt-10"><VideoGallery /></div>,

    // 5. KHỐI THƯƠNG HIỆU
    brands: (
      <section key="brands" className="bg-white p-8 rounded-lg shadow-sm mt-10 overflow-hidden">
        <h2 className="text-center text-lg font-black uppercase mb-8 text-gray-400 tracking-[0.2em]">— THƯƠNG HIỆU NỔI BẬT —</h2>
        <style>{`
          @keyframes smoothScroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .brands-track {
            display: flex;
            gap: 3rem;
            animation: smoothScroll 20s linear infinite;
            width: max-content;
          }
          .brands-track:hover {
            animation-play-state: paused;
          }
        `}</style>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10"></div>
          <div className="brands-track">
            {[...brands, ...brands].map((brand, index) => (
              <div key={index} className="flex-shrink-0 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
                <img src={brand.logo} alt={brand.name} className="h-10 md:h-14 w-auto object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      {/* VÒNG LẶP MA THUẬT: Render các khối theo ĐÚNG THỨ TỰ Admin đã sắp xếp */}
      {homeConfig.layoutOrder.map((sectionKey) => {
        // Chỉ Render nếu Admin đang BẬT (true) khối đó
        if (homeConfig.sectionVisibility[sectionKey] === true) {
          // Trả về khối tương ứng. Riêng Banner thì để full width, còn lại nhét vào box max-w-7xl
          if (sectionKey === 'banner') return PageSections[sectionKey];
          return (
            <div key={sectionKey} className="max-w-7xl mx-auto px-4">
              {PageSections[sectionKey]}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default HomePage;