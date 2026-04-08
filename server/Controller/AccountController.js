// server/Controller/AccountController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const UserModel = require("../Model/AccountModel");
const userModel = new UserModel();

require("dotenv").config();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ========== REGISTER (local) ==========
const postRegister = async (req, res) => {
  try {
    const { username, email, phone, password } = req.body || {};
    if (!username || !email || !phone || !password) {
      return res.status(400).send("Thiếu dữ liệu.");
    }

    const exists = await userModel.checkUserExists(email);
    if (exists.length > 0) {
      return res.status(400).send("Email đã tồn tại.");
    }

    const phoneExists = await userModel.checkPhoneExists(phone);
    if (phoneExists.length > 0) {
      return res.status(400).send("Số điện thoại đã tồn tại.");
    }

    const hashed = await bcrypt.hash(String(password), 10);
    await userModel.registerUser({ username, email, phone, password: hashed });

    return res.status(200).send("Đăng ký thành công!");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Đã xảy ra lỗi.");
  }
};

// ========== LOGIN (local) ==========
const postLogin = async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu username/password" });
    }

    const user = await userModel.loginUser(username);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Sai tài khoản hoặc mật khẩu" });
    }

    // Chặn đăng nhập mật khẩu nếu là tài khoản Google
    if (user.provider && user.provider !== "local") {
      return res.status(400).json({
        success: false,
        message:
          'Tài khoản này đăng ký bằng Google. Hãy dùng "Đăng nhập bằng Google" hoặc đặt mật khẩu mới.',
      });
    }

    const ok =
      user.password && (await bcrypt.compare(String(password), user.password));
    if (!ok) {
      return res
        .status(401)
        .json({ success: false, message: "Sai tài khoản hoặc mật khẩu" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "7d" }
    );

    return res.json({
      success: true,
      message: "Đăng nhập thành công",
      token,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};

// ========== LOGIN WITH GOOGLE ==========
const googleLogin = async (req, res) => {
  try {
    // frontend gửi id_token (Google One Tap / GSI) dưới field "credential"
    const { credential } = req.body || {};
    if (!credential) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu credential" });
    }

    // Verify id_token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const googleId = payload.sub;
    const email = payload.email;
    const phone = payload.phone_number;
    const emailVerified = !!payload.email_verified;
    const name = payload.name || email?.split("@")[0] || "user";
    const picture = payload.picture;

    // 1) Tìm theo google_id
    let user = await userModel.findByGoogleId(googleId);

    // 2) Chưa có -> tìm theo email để link
    if (!user && email) {
      const existing = await userModel.findByEmail(email);
      if (existing) {
        user = await userModel.linkGoogleToExisting(existing.id, {
          googleId,
          emailVerified,
          avatarUrl: picture,
        });
      }
    }

    // 3) Vẫn chưa có -> tạo mới
    if (!user) {
      const base = name.trim().toLowerCase().replace(/\s+/g, "");
      const username = base.slice(0, 30) || `user_${googleId.slice(-6)}`;
      user = await userModel.createGoogleUser({
        email,
        username,
        phone,
        googleId,
        emailVerified,
        avatarUrl: picture,
      });
    }

    // Cập nhật thời điểm đăng nhập
    await userModel.touchLastLogin(user.id);

    // JWT giống login thường
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "7d" }
    );

    return res.json({
      success: true,
      message: "Đăng nhập Google thành công",
      token,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        provider: "google",
      },
    });
  } catch (err) {
    console.error("googleLogin error:", err?.response?.data || err);
    return res
      .status(500)
      .json({ success: false, message: "Lỗi máy chủ khi đăng nhập Google" });
  }
};

module.exports = { postRegister, postLogin, googleLogin };
