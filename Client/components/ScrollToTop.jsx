import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Kéo thanh cuộn lên tọa độ X:0, Y:0 một cách mượt mà ngay khi đổi URL
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Dùng 'instant' để chớp mắt lên luôn, hoặc 'smooth' để cuộn từ từ
    });
  }, [pathname]); // Lắng nghe sự thay đổi của đường dẫn

  return null; // Component này chạy ngầm, không hiển thị gì cả
};

export default ScrollToTop;