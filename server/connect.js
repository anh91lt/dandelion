const mysql = require("mysql2/promise");

// Cấu hình kết nối MySQL
const config = {
  host: "localhost",
  user: "root", // Tên tài khoản MySQL
  password: "", // Mật khẩu
  database: "dandelion", // Tên cơ sở dữ liệu
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
    console.error("Kết nối MySQL thất bại:", err);
    throw err;
  }
}

testConnection();

module.exports = {
  pool,
  mysql,
};
