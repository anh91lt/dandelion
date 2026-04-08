const jwt = require("jsonwebtoken");
require("dotenv").config();

function auth(req, res, next) {
  // Danh sách các đường dẫn hoặc regex cần kiểm tra
  const white_list = [
    /^\/$/,
    /^\/register$/,
    /^\/login$/,
    /^\/customer$/, // Chỉ định đường dẫn /customer
    /^\/room(?:\/[a-zA-Z0-9]+)?$/,
    /^\/themKhachHang$/,
    /^\/datPhong$/,
    /^\/hoaDonList$/,
    /^\/hoadon$/,
    /^\/customer$/,
    /^\/customer(?:\/[0-9]+)?$/,
    /^\/hoadon(?:\/[0-9]+)?$/,
  ];

  console.log("!!!!! " + req.originalUrl);

  // Kiểm tra nếu `req.originalUrl` khớp với bất kỳ mẫu nào trong danh sách
  if (white_list.some((pattern) => pattern.test(req.originalUrl))) {
    next();
  } else {
    const token = req?.headers?.authorization?.split(" ")?.[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(">>> Token hợp lệ: " + decoded);
        next();
      } catch (error) {
        return res.status(401).json({
          message: "Token bị hết hạn hoặc không hợp lệ",
        });
      }
    } else {
      return res.status(401).json({
        message: "Bạn chưa truyền Access Token hoặc Token bị hết hạn",
      });
    }
  }
}

module.exports = auth;
