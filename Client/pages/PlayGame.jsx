import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { io } from 'socket.io-client';
import PoolScene from '../src/game/PoolScene';

const PlayGame = () => {
  const gameRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // 1. CHỐNG SẬP REACT: Nếu game đã render rồi thì không đẻ thêm cái thứ 2 nữa
    if (gameRef.current) return;

    // 2. Kết nối Socket
    socketRef.current = io('http://localhost:5000');

    // 3. Cấu hình Engine Game
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 400,
      parent: 'phaser-game-container', 
      physics: {
        default: 'matter', 
        matter: { 
          gravity: { y: 0 }, 
          debug: true // BẬT CÁI NÀY ĐỂ THẤY VIỀN VẬT LÝ, DỄ TEST GAME
        }
      },
      scene: [PoolScene]
    };

    // 4. Khởi tạo Game
    const game = new Phaser.Game(config);
    game.registry.set('socket', socketRef.current);
    gameRef.current = game;

    // 5. Cleanup khi thoát trang
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl md:text-5xl font-black text-yellow-400 uppercase mb-6 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]">
        X-Billiard Arena
      </h1>
      
      {/* Khung chứa Game */}
      <div 
        id="phaser-game-container" 
        className="rounded-xl overflow-hidden shadow-[0_0_30px_rgba(250,204,21,0.3)] border-4 border-yellow-600 bg-green-800"
      ></div>

      <p className="text-gray-400 font-bold mt-4">
        Click chuột vào Bi Trắng (Viền tím) để tác dụng lực. Mở 2 Tab trình duyệt để test Multiplayer!
      </p>
    </div>
  );
};

export default PlayGame;