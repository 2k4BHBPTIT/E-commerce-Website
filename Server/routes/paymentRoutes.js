const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const qs = require('qs');

// 1. DÙNG TRỰC TIẾP BIẾN NÀY, KHÔNG DÙNG THƯ VIỆN CONFIG
const vnp_TmnCode = "SDS2YVBM"; 
const vnp_HashSecret = "VOFDMCWFS5SB5HA916E62T4J8VHWUYJA"; 
const vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
const vnp_ReturnUrl = "https://billiardshop.vercel.app/"; 

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

// Đổi lại thành /create-url để khớp đúng với Checkout.jsx
router.post('/create-url', async (req, res) => {
    try {
        // Lấy đúng 2 biến mà Frontend (Checkout.jsx) gửi lên
        const { amount, bankCode } = req.body;
        
        let ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress || '127.0.0.1';

        const date = new Date();
        const createDate = date.getFullYear().toString() +
            (date.getMonth() + 1).toString().padStart(2, '0') +
            date.getDate().toString().padStart(2, '0') +
            date.getHours().toString().padStart(2, '0') +
            date.getMinutes().toString().padStart(2, '0') +
            date.getSeconds().toString().padStart(2, '0');

        const orderId = date.getTime().toString(); 

        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = vnp_TmnCode;
        vnp_Params['vnp_Locale'] = 'vn';
        vnp_Params['vnp_CurrCode'] = 'VND';
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = 'Thanh toan don hang ' + orderId; // Fix cứng an toàn
        vnp_Params['vnp_OrderType'] = 'other';
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = vnp_ReturnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;

        vnp_Params = sortObject(vnp_Params);
        
        const signData = qs.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac("sha512", vnp_HashSecret);
        
        // Dùng Buffer.from theo chuẩn Node.js mới nhất
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex"); 
        
        vnp_Params['vnp_SecureHash'] = signed;
        let finalPayUrl = vnp_Url + '?' + qs.stringify(vnp_Params, { encode: false });

        // PHẢI TRẢ VỀ JSON CHO REACT, KHÔNG DÙNG res.redirect()
        res.status(200).json({ payUrl: finalPayUrl });

    } catch (error) {
        console.error("Lỗi tạo VNPay URL:", error);
        res.status(500).json({ msg: "Lỗi server khi tạo link thanh toán" });
    }
});

module.exports = router;
