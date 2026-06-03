require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

// TỐI ƯU 1: Require Model một lần duy nhất ở đây
const Chat = require('./models/chat'); 
const connectDB = require('./config/db');

const app = express();
const server = http.createServer(app);

// Danh sách các URL được phép truy cập
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL 
].filter(Boolean);

// TỐI ƯU 2: Cấp quyền CORS cho Socket.io giống hệt Express
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});
const rooms = {};

io.on('connection', (socket) => {
  socket.on('join_chat', (userId) => {
    socket.join(`chat_${userId}`);
  });

  socket.on('send_chat_message', async (data) => {
    // Đã bỏ dòng require Chat ở đây
    const newMsg = new Chat({ userId: data.userId, userName: data.userName, message: data.message, isAdmin: false });
    await newMsg.save();
    
    io.emit('admin_receive_message', newMsg);
    io.to(`chat_${data.userId}`).emit('receive_message', newMsg);
  });

  socket.on('admin_reply_message', async (data) => {
    const newMsg = new Chat({ userId: data.userId, message: data.message, isAdmin: true });
    await newMsg.save();
    
    io.to(`chat_${data.userId}`).emit('receive_message', newMsg);
  });
});

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(cors({
  origin: allowedOrigins, // Tái sử dụng mảng đã lọc
  credentials: true,
}));

// Cấu hình thư mục chứa ảnh (Để hiển thị ảnh sản phẩm)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/', (req, res) => {
  res.send('API Billiards Shop đang hoạt động...');
});

app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/deals', require('./routes/dealRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/vouchers', require('./routes/voucherRoutes'));
app.use('/api/suppliers', require('./routes/supplierRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/settings', require('./routes/settingRoutes'));
app.use('/api/logs', require('./routes/logRoutes'));
app.use('/api/tournaments', require('./routes/tournamentRoutes'));

// Khởi động server
const startServer = async () => {
  try {
    await connectDB();
    let PORT = parseInt(process.env.PORT, 10) || 5000;
    const originalPort = PORT;
    const maxPort = PORT + 100; // Try up to 100 ports

    while (PORT < maxPort) {
      try {
        await new Promise((resolve, reject) => {
          server.listen(PORT, () => {
            console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
            resolve();
          });
          server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
              reject(new Error('EADDRINUSE'));
            } else {
              reject(error);
            }
          });
        });
        break; // Success, exit the loop
      } catch (error) {
        if (error.message === 'EADDRINUSE') {
          console.log(`Port ${PORT} is in use, trying ${PORT + 1}...`);
          PORT++;
        } else {
          throw error;
        }
      }
    }

    if (PORT >= maxPort) {
      console.error(`No free ports found between ${originalPort} and ${maxPort - 1}`);
      process.exit(1);
    }
  } catch (error) {
    console.error('Lỗi khi khởi động server:', error);
    process.exit(1);
  }
};

startServer();