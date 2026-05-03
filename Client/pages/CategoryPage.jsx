import { useEffect, useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import { Filter, Tag } from 'lucide-react'; 

const CategoryPage = ({ isSearchPage = false }) => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q');
  const normalizedSearchQuery = (searchQuery || '').trim();
  
  const [data, setData] = useState({ products: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);

  // CÁC STATE LƯU TRẠNG THÁI BỘ LỌC
  const [filters, setFilters] = useState({ page: 1, sort: 'default' });
  const [selectedSubCat, setSelectedSubCat] = useState('Tất cả'); 
  const [selectedPrice, setSelectedPrice] = useState('all');      

  // 1. TỪ ĐIỂN DỊCH TÊN GIAO DIỆN (UI)
  const getCategoryName = (currentSlug) => {
    if (!currentSlug) return '';
    const map = {
      'gay-bi-a': 'Gậy Bi A',
      'cues': 'Gậy Bi A',
      'Cues': 'Gậy Bi A',
      'phu-kien': 'Phụ Kiện Chính Hãng',
      'accessories': 'Phụ Kiện Chính Hãng',
      'Accessories': 'Phụ Kiện Chính Hãng',
      'dich-vu': 'Dịch Vụ',
      'services': 'Dịch Vụ',
      'Services': 'Dịch Vụ'
    };
    return map[currentSlug] || currentSlug;
  };

  // 2. TỪ ĐIỂN DỊCH CHUẨN DATABASE (ĐÂY LÀ CHỖ SỬA LỖI HIỂN THỊ TOÀN BỘ SẢN PHẨM)
  const getDbCategory = (currentSlug) => {
    if (!currentSlug) return '';
    const map = {
      'gay-bi-a': 'Cues',
      'cues': 'Cues',
      'Cues': 'Cues',
      'phu-kien': 'Accessories',
      'accessories': 'Accessories',
      'Accessories': 'Accessories',
      'dich-vu': 'Services',
      'services': 'Services',
      'Services': 'Services'
    };
    // Nếu không khớp, trả về chính nó để dự phòng
    return map[currentSlug] || currentSlug; 
  };

  // 3. MENU ĐỘNG CHO SIDEBAR BÊN TRÁI
  const sidebarMenus = {
    'Cues': ['Tất cả', 'Fury', 'Peri', 'Mezz', 'Wolf', 'Cuetec'],
    'Accessories': ['Tất cả', 'Lơ bida', 'Tẩy (Đầu cơ)', 'Găng tay', 'Bao cơ', 'Film xếp bi', 'Khúc nối'],
    'Services': ['Tất cả', 'Thay tẩy (Đầu cơ)', 'Sửa chữa ngọn', 'Bảo dưỡng bàn', 'Lắp đặt bàn', 'Tư vấn Setup CLB'],
  };
  
  // Lấy menu tương ứng với danh mục hiện tại
  const currentDbCategory = getDbCategory(slug);
  const currentSidebar = sidebarMenus[currentDbCategory] || ['Tất cả'];

  // Reset bộ lọc frontend khi người dùng bấm sang Menu khác trên Header
  useEffect(() => {
    setSelectedSubCat('Tất cả');
    setSelectedPrice('all');
    setFilters({ page: 1, sort: 'default' });
  }, [slug]);

  // Gọi API lấy dữ liệu gốc từ DB
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/products`, {
          params: {
            search: isSearchPage ? normalizedSearchQuery : '',
            category: isSearchPage ? '' : getDbCategory(slug), // Đã bắt chặt dữ liệu gửi xuống Backend
            sort: filters.sort,
            page: filters.page,
            limit: 50 
          }
        });
        setData(res.data);
      } catch (err) {
        console.error("Lỗi lấy sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters.sort, filters.page, normalizedSearchQuery, slug, isSearchPage]);

  // 4. BỘ LỌC DỮ LIỆU TỰ ĐỘNG TRÊN FRONTEND
  const filteredProducts = useMemo(() => {
    if (!data.products) return [];
    let result = [...data.products];

    // Nếu đang ở trang TÌM KIẾM, đảm bảo chỉ hiển thị sản phẩm thật sự khớp từ khóa
    if (isSearchPage && normalizedSearchQuery) {
      const kw = normalizedSearchQuery.toLowerCase();
      result = result.filter((p) => {
        const name = (p.name || '').toLowerCase();
        const category = (p.category || '').toLowerCase();
        const brand = (p.brand || '').toLowerCase();
        return (
          name.includes(kw) ||
          category.includes(kw) ||
          brand.includes(kw)
        );
      });
    }

    // Lọc theo Danh mục con (Thương hiệu / Loại phụ kiện)
    if (selectedSubCat !== 'Tất cả') {
      result = result.filter(p => p.name.toLowerCase().includes(selectedSubCat.toLowerCase()));
    }

    // Lọc theo Khoảng Giá
    if (selectedPrice !== 'all') {
      result = result.filter(p => {
        if (selectedPrice === 'under-1m') return p.price < 1000000;
        if (selectedPrice === '1m-3m') return p.price >= 1000000 && p.price <= 3000000;
        if (selectedPrice === '3m-10m') return p.price > 3000000 && p.price <= 10000000;
        if (selectedPrice === 'over-10m') return p.price > 10000000;
        return true;
      });
    }

    return result;
  }, [data.products, selectedSubCat, selectedPrice, isSearchPage, normalizedSearchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
      {/* SIDEBAR BÊN TRÁI */}
      <aside className="w-64 flex-shrink-0 hidden md:block">
        
        {/* Danh mục con */}
        <div className="mb-10 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-black uppercase text-gray-800 flex items-center gap-2 mb-4 border-b pb-2">
            <Tag size={18} className="text-red-600" /> Danh mục
          </h2>
          <ul className="space-y-3 text-sm font-bold text-gray-600">
             {currentSidebar.map(cat => (
               <li 
                 key={cat} 
                 onClick={() => setSelectedSubCat(cat)}
                 className={`cursor-pointer transition-colors ${selectedSubCat === cat ? 'text-red-600 ml-2' : 'hover:text-red-600 hover:ml-1'}`}
               >
                 › {cat}
               </li>
             ))}
          </ul>
        </div>
        
        {/* Khoảng giá */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-black uppercase text-gray-800 flex items-center gap-2 mb-4 border-b pb-2">
            <Filter size={18} className="text-red-600" /> Khoảng giá
          </h2>
          <div className="space-y-3 text-sm font-bold text-gray-600 flex flex-col">
            <label className="flex items-center gap-3 cursor-pointer hover:text-red-600">
              <input type="radio" name="price" checked={selectedPrice === 'all'} onChange={() => setSelectedPrice('all')} className="accent-red-600 w-4 h-4" /> Tất cả
            </label>
            <label className="flex items-center gap-3 cursor-pointer hover:text-red-600">
              <input type="radio" name="price" checked={selectedPrice === 'under-1m'} onChange={() => setSelectedPrice('under-1m')} className="accent-red-600 w-4 h-4" /> Dưới 1 triệu
            </label>
            <label className="flex items-center gap-3 cursor-pointer hover:text-red-600">
              <input type="radio" name="price" checked={selectedPrice === '1m-3m'} onChange={() => setSelectedPrice('1m-3m')} className="accent-red-600 w-4 h-4" /> 1 triệu - 3 triệu
            </label>
            <label className="flex items-center gap-3 cursor-pointer hover:text-red-600">
              <input type="radio" name="price" checked={selectedPrice === '3m-10m'} onChange={() => setSelectedPrice('3m-10m')} className="accent-red-600 w-4 h-4" /> 3 triệu - 10 triệu
            </label>
            <label className="flex items-center gap-3 cursor-pointer hover:text-red-600">
              <input type="radio" name="price" checked={selectedPrice === 'over-10m'} onChange={() => setSelectedPrice('over-10m')} className="accent-red-600 w-4 h-4" /> Trên 10 triệu
            </label>
          </div>
        </div>
      </aside>

      {/* NỘI DUNG CHÍNH BÊN PHẢI */}
      <div className="flex-1">
        <div className="mb-6 border-b pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl font-black uppercase text-gray-900 border-l-4 border-red-600 pl-4">
            {isSearchPage ? `KẾT QUẢ TÌM KIẾM: "${normalizedSearchQuery}"` : `${getCategoryName(slug)}`}
          </h1>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-500">Sắp xếp:</span>
            <select 
              className="border p-2 rounded-lg font-bold text-sm outline-none cursor-pointer hover:border-red-600 transition-colors"
              value={filters.sort}
              onChange={(e) => setFilters({...filters, sort: e.target.value, page: 1})}
            >
              <option value="default">Mới nhất</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
            </select>
          </div>
        </div>

        {/* Cảnh báo đang áp dụng bộ lọc */}
        {(selectedSubCat !== 'Tất cả' || selectedPrice !== 'all') && (
          <div className="mb-6 bg-red-50 text-red-700 p-3 rounded-lg text-sm font-bold flex justify-between items-center border border-red-100">
            <span>Đang lọc: {selectedSubCat !== 'Tất cả' ? `"${selectedSubCat}"` : ''} {selectedPrice !== 'all' ? '| Theo khoảng giá' : ''} ({filteredProducts.length} kết quả)</span>
            <button onClick={() => {setSelectedSubCat('Tất cả'); setSelectedPrice('all')}} className="underline hover:text-red-900">Xóa bộ lọc</button>
          </div>
        )}

        {/* LƯỚI SẢN PHẨM */}
        {loading ? (
          <div className="text-center py-20 font-bold text-gray-500">Đang tải sản phẩm...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => <ProductCard key={product._id} product={product} />)
            ) : (
              <div className="col-span-3 text-center py-20 bg-white rounded-xl border border-gray-100">
                <p className="text-gray-500 font-bold mb-2">Không tìm thấy sản phẩm nào phù hợp với bộ lọc.</p>
                <button onClick={() => {setSelectedSubCat('Tất cả'); setSelectedPrice('all')}} className="text-red-600 underline text-sm font-bold">Hiển thị tất cả</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;