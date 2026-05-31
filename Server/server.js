require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const http = require('http'); // Import module có sẵn của Node.js
const { Server } = require('socket.io');

// Khởi tạo app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true
  }
});
const rooms = {};

// Kết nối DB SAU khi app được tạo (để tránh double-connect)
const connectDB = require('./config/db');

io.on('connection', (socket) => {
  socket.on('join_chat', (userId) => {
    socket.join(`chat_${userId}`); // Khách tự vào phòng của mình, Admin cũng vào phòng này để rep
  });

  // Khách nhắn tin
  socket.on('send_chat_message', async (data) => {
    const Chat = require('./models/chat');
    const newMsg = new Chat({ userId: data.userId, userName: data.userName, message: data.message, isAdmin: false });
    await newMsg.save();
    
    io.emit('admin_receive_message', newMsg); // Gửi cho Admin (để hiện Inbox)
    io.to(`chat_${data.userId}`).emit('receive_message', newMsg); // CHỈ gửi lại cho đúng người nhắn
  });

  // Admin nhắn tin
  socket.on('admin_reply_message', async (data) => {
    const Chat = require('./models/chat');
    // data: { userId, message }
    const newMsg = new Chat({ userId: data.userId, message: data.message, isAdmin: true });
    await newMsg.save();
    
    // Phát lại vào phòng của đúng ông khách đó
    io.to(`chat_${data.userId}`).emit('receive_message', newMsg);
  });
});

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173'
  ],
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