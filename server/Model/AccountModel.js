// server/Model/AccountModel.js
const { pool } = require("../connect");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

module.exports = class UserModel {
  // Kiểm tra email đã tồn tại
  async checkUserExists(email) {
    const [rows] = await pool.query(
      "SELECT id FROM account WHERE email = ? LIMIT 1",
      [email]
    );
    return rows; // mảng rỗng nếu chưa có
  }

  async checkPhoneExists(phone) {
    const [rows] = await pool.query(
      "SELECT id FROM account WHERE phone = ? LIMIT 1",
      [phone]
    );
    return rows; // mảng rỗng nếu chưa có
  }

  // Đăng ký user local
  async registerUser({ username, email, phone, password }) {
    await pool.query(
      `INSERT INTO account
         (username, email, phone, password, createdAt, role, provider, email_verified, last_login)
       VALUES
         (?, ?, ?, ?, NOW(), 0, 'local', 0, NOW())`,
      [username, email, phone, password]
    );
  }

  // Dùng cho login thường (nhận username OR email)
  async loginUser(identifier) {
    const [rows] = await pool.query(
      `SELECT id, username, email, password, role, provider, google_id,
              email_verified, avatar_url, last_login
         FROM account
        WHERE username = ? OR email = ?
        LIMIT 1`,
      [identifier, identifier]
    );
    return rows[0] || null;
  }

  // --- Google helpers ---

  async findByGoogleId(googleId) {
    if (!googleId) return null;
    const [rows] = await pool.query(
      `SELECT id, username, email, password, role, provider, google_id,
              email_verified, avatar_url, last_login
         FROM account
        WHERE google_id = ?
        LIMIT 1`,
      [googleId]
    );
    return rows[0] || null;
  }

  async findByEmail(email) {
    if (!email) return null;
    const [rows] = await pool.query(
      `SELECT id, username, email, password, role, provider, google_id,
              email_verified, avatar_url, last_login
         FROM account
        WHERE email = ?
        LIMIT 1`,
      [email]
    );
    return rows[0] || null;
  }

  // Liên kết Google vào 1 tài khoản đã tồn tại
  async linkGoogleToExisting(id, { googleId, emailVerified, avatarUrl }) {
    await pool.query(
      `UPDATE account
          SET provider='google',
              google_id=?,
              email_verified=?,
              avatar_url=COALESCE(?, avatar_url)
        WHERE id=?`,
      [googleId, emailVerified ? 1 : 0, avatarUrl || null, id]
    );
    const [rows] = await pool.query(
      `SELECT id, username, email, password, role, provider, google_id,
              email_verified, avatar_url, last_login
         FROM account WHERE id=?`,
      [id]
    );
    return rows[0] || null;
  }

  // Tạo mới user từ Google (đặt password ngẫu nhiên đã băm)
  async createGoogleUser({
    email,
    username,
    googleId,
    emailVerified,
    avatarUrl,
  }) {
    const randomSecret = crypto.randomBytes(32).toString("hex");
    const hashed = await bcrypt.hash(randomSecret, 12);

    const [result] = await pool.query(
      `INSERT INTO account
         (username, email, password, createdAt, role, provider,
          google_id, email_verified, avatar_url, last_login)
       VALUES
         (?, ?, ?, NOW(), 0, 'google', ?, ?, ?, NOW())`,
      [
        username,
        email,
        hashed,
        googleId,
        emailVerified ? 1 : 0,
        avatarUrl || null,
      ]
    );

    const [rows] = await pool.query(
      `SELECT id, username, email, password, role, provider, google_id,
              email_verified, avatar_url, last_login
         FROM account WHERE id=?`,
      [result.insertId]
    );
    return rows[0] || null;
  }

  async touchLastLogin(id) {
    await pool.query(`UPDATE account SET last_login = NOW() WHERE id=?`, [id]);
  }
};
