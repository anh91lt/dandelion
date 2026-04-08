import React from "react";
import GoogleLoginButton from "../GoogleLoginButton";
const FormLogin = ({ handleSubmit, handleChange, loading }) => {
  return (
    <>
      <h1 className="account-title">Đăng Nhập</h1>

      {/* Google official button */}
      <GoogleLoginButton />

      <div className="divider">Hoặc đăng nhập bằng email</div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            name="usernameOrEmail"
            placeholder="Tài khoản hoặc Email"
            required
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            className="form-control"
            name="password"
            placeholder="Mật khẩu"
            required
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Đang xử lý..." : "Đăng nhập"}
        </button>
      </form>

      <div className="auth-switch">
        Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
      </div>
    </>
  );
};

export default FormLogin;
