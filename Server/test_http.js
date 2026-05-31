const http = require('http');

const email = 'http' + Date.now() + '@test.com';
const data = JSON.stringify({
  name: 'Test User', email: email, password: 'testpass123',
  role: 'user', walletBalance: 0, luckySpins: 0, vouchers: []
});

console.log('Sending to /api/users/register');
console.log('Body:', data);

const req = http.request({
  hostname: 'localhost', port: 5000, path: '/api/users/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
    'Accept': 'application/json'
  }
}, (res) => {
  let d = '';
  console.log('\nResponse status:', res.statusCode);
  res.on('data', (c) => d += c);
  res.on('end', () => {
    console.log('Body:', d);
    process.exit(0);
  });
});

req.on('error', (e) => {
  console.error('Request error:', e);
  process.exit(1);
});

req.write(data);
req.end();
