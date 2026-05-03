// src/context/CartContext.jsx
import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false); // Quản lý đóng mở sidebar

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prev => {
      // Ưu tiên lấy dealPrice nếu có (cho các sản phẩm từ Flash Deal)
      // Chuyển về kiểu Number để tránh lỗi tính toán
      const finalPrice = Number(product.dealPrice || product.price || 0);
      
      const isExist = prev.find(item => item._id === product._id);
      if (isExist) {
        return prev.map(item => 
          item._id === product._id 
            ? { ...item, quantity: item.quantity + 1, price: finalPrice } 
            : item
        );
      }
      return [...prev, { ...product, price: finalPrice, quantity: 1 }];
    });
    alert("Đã thêm vào giỏ hàng!");
  };

  const updateQuantity = (id, amount) => {
    setCartItems(prev => prev.map(item => 
      item._id === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
    ));
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item._id !== id));
  };

  const clearCart = () => setCartItems([]);

  // Tính tổng tiền an toàn, đảm bảo item.price và item.quantity là số
  const totalPrice = cartItems.reduce((total, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    return total + (price * quantity);
  }, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart, totalPrice, isCartOpen, setIsCartOpen }}>
      {children}
    </CartContext.Provider>
  );
};