const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

function auth(req, res, next) {
  const whiteList = [
    /^\/$/,
    /^\/register$/,
    /^\/login$/,
    /^\/customer(?:\/[0-9]+)?$/,
    /^\/hoadon(?:\/[0-9]+)?$/,
  ];

  if (whiteList.some((pattern) => pattern.test(req.originalUrl))) return next();

  const token = req?.headers?.authorization?.split(" ")?.[1];
  if (!token) {
    return res.status(401).json({
      message: "Bạn chưa truyền Access Token hoặc Token bị hết hạn",
    });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({
      message: "Token bị hết hạn hoặc không hợp lệ",
    });
  }
}

module.exports = auth;