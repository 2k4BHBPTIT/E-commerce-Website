// src/pages/LuckyWheel.jsx
import { useState, useContext, useEffect } from 'react';
import { Gift, Sparkles, XCircle, Ticket, Copy, CheckCircle, Frown } from 'lucide-react'; // Đã thêm icon Frown (Mặt mếu)
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const PRIZES = [
  { id: 1, text: 'Voucher 5%', color: '#dc2626', type: 'voucher' }, 
  { id: 2, text: 'Chúc May Mắn', color: '#1f2937', type: 'miss' }, 
  { id: 3, text: 'Voucher 200K', color: '#dc2626', type: 'voucher' },
  { id: 4, text: 'Voucher 50K', color: '#1f2937', type: 'voucher' },
  { id: 5, text: 'Voucher 500K', color: '#dc2626', type: 'voucher' }, // Đã sửa lỗi chính tả 'vouchert' của bạn
  { id: 6, text: 'Chúc May Mắn', color: '#1f2937', type: 'miss' },
  { id: 7, text: 'Voucher 10%', color: '#dc2626', type: 'voucher' },
  { id: 8, text: 'Voucher 100K', color: '#1f2937', type: 'voucher' },
];

const LuckyWheel = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [spinsLeft, setSpinsLeft] = useState(0); 
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  
  const [prizeWin, setPrizeWin] = useState(null);
  const [wonCode, setWonCode] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (user) setSpinsLeft(user.luckySpins || 0);
  }, [user]);

  const spinWheel = () => {
    if (!user) {
      alert("Vui lòng đăng nhập để tham gia vòng quay!");
      navigate('/login');
      return;
    }
    if (spinsLeft <= 0) {
      alert("Bạn đã hết lượt quay! Mua thêm sản phẩm để nhận lượt nhé.");
      return;
    }
    if (isSpinning) return;

    setIsSpinning(true);
    setSpinsLeft(prev => prev - 1); 
    setPrizeWin(null);
    setIsCopied(false);

    const newDegree = Math.floor(Math.random() * 360) + (360 * 8); 
    const totalRotation = rotation + newDegree;
    setRotation(totalRotation);

    setTimeout(async () => {
      const actualDegree = totalRotation % 360;
      const sliceAngle = 360 / PRIZES.length;
      const winningIndex = Math.floor((360 - (actualDegree % 360) + (sliceAngle / 2)) % 360 / sliceAngle);
      const wonPrize = PRIZES[winningIndex];

      try {
        const res = await API.post('/users/claim-prize', { prize: wonPrize });
        setSpinsLeft(res.data.luckySpins);
        if (res.data.voucherCode) {
          setWonCode(res.data.voucherCode);
        }
      } catch (error) {
        console.error("Lỗi khi lưu kết quả:", error);
        alert("❌ Vòng quay bị lỗi ngầm! Vui lòng kiểm tra lại Backend.");
      }

      setPrizeWin(wonPrize);
      setIsSpinning(false);
    }, 5000); 
  };

  const copyToClipboard = () => {
    if (wonCode) {
      navigator.clipboard.writeText(wonCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleCloseModal = () => {
    setPrizeWin(null);
    setIsCopied(false);
  };

  return (
    <div className="min-h-[85vh] bg-gray-900 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
      
      <div className="relative z-10 text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-black text-yellow-400 uppercase drop-shadow-[0_0_15px_rgba(250,204,21,0.8)] flex items-center justify-center gap-3 mb-3">
          <Sparkles size={40} className="animate-pulse" /> Vòng Quay May Mắn <Sparkles size={40} className="animate-pulse" />
        </h1>
        <div className="bg-black/50 border border-yellow-500/50 inline-block px-6 py-2 rounded-full backdrop-blur-sm">
          <p className="text-white font-bold text-lg">
            Bạn đang có: <span className="text-yellow-400 text-2xl mx-1 font-black">{spinsLeft}</span> lượt quay
          </p>
        </div>
      </div>

      {/* ========================================== */}
      {/* VÒNG QUAY ĐƯỢC THIẾT KẾ LẠI HOÀN TOÀN TỪ ĐÂY */}
      {/* ========================================== */}
      <div className="relative w-80 h-80 md:w-96 md:h-96">
        {/* Kim chỉ nam */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 w-12 h-16 bg-yellow-400" style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }}></div>
        
        {/* Container quay */}
        <div 
          className="w-full h-full rounded-full border-8 border-yellow-500 shadow-[0_0_40px_rgba(250,204,21,0.5)] overflow-hidden relative"
          style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 5s cubic-bezier(0.15, 0.8, 0.2, 1)' }}
        >
          
          {/* LỚP 1: VẼ NỀN 8 Ô BẰNG CONIC-GRADIENT (Chuẩn xác 100%) */}
          <div 
            className="absolute inset-0"
            style={{
              background: `conic-gradient(from -${360 / PRIZES.length / 2}deg, ${PRIZES.map((prize, i) => {
                const angle = 360 / PRIZES.length;
                return `${prize.color} ${i * angle}deg ${(i + 1) * angle}deg`;
              }).join(', ')})`
            }}
          ></div>

          {/* LỚP 2: HIỂN THỊ ICON VÀ CHỮ LÊN TỪNG Ô (Trôi nổi bên trên, không bị bóp méo) */}
          <div className="absolute inset-0">
            {PRIZES.map((prize, index) => {
              const rotate = index * (360 / PRIZES.length); // Tâm của ô sẽ nằm chính xác ở góc này
              
              // Chọn Icon dựa theo loại quà
              let Icon = Ticket; 
              if (prize.type === 'miss') Icon = Frown;
              if (prize.type === 'gift') Icon = Gift;

              return (
                <div 
                  key={`content-${prize.id}`}
                  className="absolute w-[80px] h-[90px] flex flex-col items-center justify-start pt-3 z-10"
                  style={{ 
                    top: '50%', 
                    left: '50%', 
                    // Dịch về giữa, xoay theo đúng góc, rồi đẩy tịnh tiến thẳng lên rìa vòng quay
                    transform: `translate(-50%, -50%) rotate(${rotate}deg) translateY(-100px)` 
                  }}
                >
                  {/* ICON HÌNH ẢNH */}
                  <Icon 
                    size={32} 
                    className={prize.type === 'miss' ? 'text-gray-400' : 'text-yellow-300'} 
                    style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.6))' }} 
                  />
                  
                  {/* TEXT RÚT GỌN (VD: Xóa chữ Voucher đi chỉ để lại "500K") */}
                  <span 
                    className="text-white font-black uppercase text-[11px] md:text-xs text-center mt-1 leading-tight"
                    style={{ textShadow: '0px 2px 4px rgba(0,0,0,0.8)' }}
                  >
                    {prize.text.replace('Voucher ', '')}
                  </span>
                </div>
              );
            })}
          </div>

        </div>

        {/* Nút Quay ở giữa */}
        <button 
          onClick={spinWheel}
          disabled={isSpinning}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-yellow-300 to-yellow-500 hover:from-yellow-400 hover:to-yellow-600 rounded-full z-30 font-black uppercase text-red-800 shadow-2xl border-4 border-white flex items-center justify-center cursor-pointer transition-transform hover:scale-110 disabled:scale-100 disabled:opacity-80"
        >
          {isSpinning ? '...' : 'QUAY'}
        </button>
      </div>

      {/* CỬA SỔ NỔI (MODAL) HIỂN THỊ KẾT QUẢ - Giữ nguyên không đổi */}
      {prizeWin && (
        <div className="fixed inset-0 bg-black/80 z-[999] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center relative shadow-[0_0_50px_rgba(250,204,21,0.4)] transform scale-100 animate-in zoom-in-95">
            
            <button onClick={handleCloseModal} className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors">
              <XCircle size={28} />
            </button>
            
            {prizeWin.type === 'miss' && (
              <>
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle size={48} className="text-gray-400" />
                </div>
                <h3 className="text-2xl font-black text-gray-800 uppercase mb-2">Trượt mất rồi!</h3>
                <p className="text-gray-600 font-bold">Hãy thử vận may ở lượt quay tiếp theo nhé. Chúc bạn may mắn lần sau!</p>
              </>
            )}

            {prizeWin.type === 'gift' && (
              <>
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <Gift size={48} className="text-red-600" />
                </div>
                <h3 className="text-2xl font-black text-red-600 uppercase mb-2">Trúng Lớn Rồi!</h3>
                <p className="text-gray-600 font-bold mb-4">Phần quà của bạn là:</p>
                <div className="bg-gradient-to-r from-red-600 to-red-800 text-white font-black text-xl py-3 px-4 rounded-xl uppercase shadow-lg">
                  {prizeWin.text}
                </div>
                <p className="text-xs text-gray-500 mt-4 font-bold">* Quà tặng sẽ được đóng gói và gửi kèm trong đơn hàng tiếp theo của bạn.</p>
              </>
            )}

            {(prizeWin.type === 'voucher' || prizeWin.type === 'vouchert') && (
              <>
                <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Ticket size={48} className="text-yellow-600" />
                </div>
                <h3 className="text-2xl font-black text-yellow-600 uppercase mb-2">Nhận Lộc Liền Tay!</h3>
                <p className="text-gray-600 font-bold mb-4">Bạn vừa nhận được 1 Voucher giảm giá:</p>
                
                <div className="relative bg-red-50 border-2 border-dashed border-red-300 rounded-xl p-4 mb-4">
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border-r-2 border-dashed border-red-300"></div>
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border-l-2 border-dashed border-red-300"></div>
                  
                  <div className="font-black text-2xl text-red-600 uppercase mb-1">{prizeWin.text}</div>
                  <div className="text-gray-500 text-xs font-bold mb-3">Hạn sử dụng: 30 ngày</div>
                  
                  {wonCode && (
                    <button 
                      onClick={copyToClipboard}
                      className="w-full bg-red-600 hover:bg-black text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      {isCopied ? <><CheckCircle size={18} /> Đã chép mã</> : <><Copy size={18} /> {wonCode}</>}
                    </button>
                  )}
                </div>
                
                <p className="text-xs text-gray-500 font-bold">* Voucher đã được tự động lưu vào <span className="text-red-600">Ví X-Billiard</span> của bạn.</p>
              </>
            )}

            <button 
              onClick={handleCloseModal}
              className="mt-6 font-bold text-gray-400 hover:text-gray-800 underline transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LuckyWheel;

