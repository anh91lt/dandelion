const mysql = require("mysql2/promise");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

// Cấu hình kết nối MySQL
const config = {
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "dandelion",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Hàm kết nối và trả về pool
const pool = mysql.createPool(config);

// Hàm kiểm tra kết nối
async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log("Kết nối MySQL thành công!");
    conn.release();
  } catch (err) {
    console.error("Kết nối MySQL thất bại:", err.code || err.message);
    // Không throw để tránh crash khi khởi động
  }
}

module.exports = {
  pool,
  mysql,
  testConnection,
};
