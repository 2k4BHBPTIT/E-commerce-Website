require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const dealRoutes = require('./routes/dealRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const chatRoutes = require('./routes/chatRoutes');
const Chat = require('./models/chat');
const voucherRoutes = require('./routes/voucherRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const http = require('http'); // Import module có sẵn của Node.js
const { Server } = require('socket.io');
const logRoutes = require('./routes/logRoutes');
const settingRoutes = require('./routes/settingRoutes');


// Khởi tạo app
const app = express();
connectDB();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Link React của bạn
    methods: ["GET", "POST"]
  }
});
const rooms = {};

io.on('connection', (socket) => {
  console.log('🎮 Cơ thủ kết nối:', socket.id);
  
  socket.on('join_room', (roomId) => {
    // Nếu phòng chưa có, tạo phòng mới
    if (!rooms[roomId]) rooms[roomId] = { players: [], turn: null };
    
    // Giới hạn 2 người / phòng
    if (rooms[roomId].players.length >= 2) {
      socket.emit('room_full');
      return;
    }

    rooms[roomId].players.push(socket.id);
    socket.join(roomId);
    socket.roomId = roomId; // Lưu lại ID phòng vào socket để lát xử lý lúc thoát

    // Phân vai: Người vào trước là Player 1 (được phá bi), người vào sau là Player 2
    const myRole = rooms[roomId].players.length === 1 ? 'Player 1' : 'Player 2';
    socket.emit('role_assigned', myRole);

    // Đủ 2 người thì bắt đầu ván đấu!
    if (rooms[roomId].players.length === 2) {
      rooms[roomId].turn = 'Player 1'; // P1 được đánh trước
      io.to(roomId).emit('game_start', { currentTurn: 'Player 1' });
    }
  });

  // NHẬN LỆNH ĐẶT BI
  socket.on('place_ball', (data) => {
    socket.to(data.roomId).emit('opponent_place_ball', data);
  });

  // NHẬN LỆNH ĐÁNH VÀ CHUYỂN LƯỢT
  socket.on('strike_ball', (data) => {
    // Chuyển lượt đánh trên Server
    rooms[data.roomId].turn = data.nextTurn;
    socket.to(data.roomId).emit('opponent_strike', data);
    io.to(data.roomId).emit('update_turn', data.nextTurn); // Báo cho cả 2 biết lượt của ai
  });

  // XỬ LÝ KHI 1 NGƯỜI CAY CÚ THOÁT GAME HOẶC RỚT MẠNG
  socket.on('disconnect', () => {
    console.log('❌ Cơ thủ đã thoát:', socket.id);
    if (socket.roomId && rooms[socket.roomId]) {
      // Báo cho người còn lại biết đối thủ đã chạy trốn
      io.to(socket.roomId).emit('opponent_left');
      delete rooms[socket.roomId]; // Hủy luôn phòng đó
    }
  });

  socket.on('join_chat', (userId) => {
    socket.join(`chat_${userId}`); // Khách tự vào phòng của mình, Admin cũng vào phòng này để rep
  });

  // Khách nhắn tin
  socket.on('send_chat_message', async (data) => {
  const newMsg = new Chat({ userId: data.userId, userName: data.userName, message: data.message, isAdmin: false });
  await newMsg.save();
  
  io.emit('admin_receive_message', newMsg); // Gửi cho Admin (để hiện Inbox)
  io.to(`chat_${data.userId}`).emit('receive_message', newMsg); // CHỈ gửi lại cho đúng người nhắn
});

  // Admin nhắn tin
  socket.on('admin_reply_message', async (data) => {
    // data: { userId, message }
    const newMsg = new Chat({ userId: data.userId, message: data.message, isAdmin: true });
    await newMsg.save();
    
    // Phát lại vào phòng của đúng ông khách đó
    io.to(`chat_${data.userId}`).emit('receive_message', newMsg);
  });
});

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [
      process.env.CLIENT_ORIGIN,
      'http://localhost:5173', // Vite default
      'http://localhost:3000'  // CRA default
    ].filter(Boolean),
    credentials: true,
}));

// Cấu hình thư mục chứa ảnh (Để hiển thị ảnh sản phẩm)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes cơ bản (Chúng ta sẽ thêm Router chi tiết sau)
app.get('/', (req, res) => {
    res.send('API Billiards Shop đang hoạt động...');
});

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/vouchers', voucherRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/logs', logRoutes);

// Khởi động server

const startServer = async () => {
  try {
    await connectDB(); 
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Lỗi khi khởi động server:", error);
  }
};

startServer();