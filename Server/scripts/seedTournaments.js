const mongoose = require('mongoose');
const Tournament = require('./models/Tournament');

const sampleTournaments = [
  {
    name: 'X-BILLIARD OPEN 2026',
    description: 'Giải đấu lớn nhất năm dành cho cơ thủ hạng H và I. Thể thức Single Elimination.',
    prize: 10000000,
    entryFee: 200000,
    maxPlayers: 32,
    location: 'CLB Billiard X-Billiard, Quận 1, TP.HCM',
    date: new Date('2026-06-15T09:00:00'),
    registrationDeadline: new Date('2026-06-08T23:59:59'),
    format: 'Single Elimination',
    class: 'Hạng H',
    status: 'registering',
    contactPhone: '0836204777',
    contactEmail: 'tournament@xbilliard.com',
    rules: '1. Luật pool 8 bi tiêu chuẩn.\n2. Cơ thủ phải có hạng H theo quy định VBF.\n3. Trọng tài chính thức.\n4. Cấm sửa cơ trong trận đấu.',
    isActive: true
  },
  {
    name: 'SUMMER CUP 2026',
    description: 'Giải đấu mùa hè dành cho cơ thủ hạng I. Thể thức Double Elimination.',
    prize: 5000000,
    entryFee: 100000,
    maxPlayers: 32,
    location: 'CLB Billiard X-Billiard, Quận 1, TP.HCM',
    date: new Date('2026-07-01T09:00:00'),
    registrationDeadline: new Date('2026-06-24T23:59:59'),
    format: 'Double Elimination',
    class: 'Hạng I',
    status: 'registering',
    contactPhone: '0836204777',
    contactEmail: 'tournament@xbilliard.com',
    rules: '1. Luật pool 8 bi tiêu chuẩn.\n2. Cơ thủ hạng I trở lên.\n3. Hệ đôi loại trực tiếp.',
    isActive: true
  },
  {
    name: 'WEEKLY MASTER',
    description: 'Giải đấu hàng tuần dành cho cơ thủ hạng H và I. Thể thức Round Robin.',
    prize: 3000000,
    entryFee: 50000,
    maxPlayers: 16,
    location: 'CLB Billiard X-Billiard',
    date: new Date('2026-06-06T09:00:00'),
    registrationDeadline: new Date('2026-06-05T18:00:00'),
    format: 'Round Robin',
    class: 'Hạng H & I',
    status: 'registering',
    contactPhone: '0836204777',
    contactEmail: 'tournament@xbilliard.com',
    rules: '1. Vòng tròn tính điểm.\n2. 16 cơ thủ tham gia.\n3. Giải đấu hàng thứ 7.',
    isActive: true
  },
  {
    name: 'TIKTOK CHALLENGE',
    description: 'Giải đấu trực tuyến livestream dành cho cơ thủ hạng I.',
    prize: 2000000,
    entryFee: 0,
    maxPlayers: 64,
    location: 'Livestream Facebook',
    date: new Date('2026-06-20T14:00:00'),
    registrationDeadline: new Date('2026-06-15T23:59:59'),
    format: 'Single Elimination',
    class: 'Hạng I',
    status: 'upcoming',
    contactPhone: '0836204777',
    contactEmail: 'tournament@xbilliard.com',
    rules: '1. Livestream thi đấu.\n2. Miễn phí đăng ký.\n3. Top 16 vào vòng trong.',
    isActive: true
  }
];

const seedTournaments = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/billiardshop');
    console.log('Đã kết nối DB');

    await Tournament.deleteMany({});
    console.log('Đã xoá giải đấu cũ');

    const created = await Tournament.insertMany(sampleTournaments);
    console.log(`Đã tạo ${created.length} giải đấu mẫu:`);
    created.forEach(t => console.log(` - ${t.name} (${t._id})`));

    await mongoose.disconnect();
    console.log('Hoàn tất seed.');
  } catch (err) {
    console.error('Lỗi seed giải đấu:', err);
    process.exit(1);
  }
};

seedTournaments();
