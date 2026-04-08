import React from "react";

const FormRegister = ({ handleSubmit, handleChange, loading }) => {
  return (
    <>
      <h1 className="account-title">Tạo Tài Khoản</h1>

      <button className="social-login-btn">
        <img src="/images/signin/google.svg" alt="Google icon" />
        Tiếp tục với Google
      </button>

      <div className="divider">Hoặc đăng ký bằng email</div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            name="username"
            placeholder="Tên tài khoản"
            required
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="tel"
            className="form-control"
            name="phone"
            inputMode="numeric"
            pattern="^0\d{9}$"
            placeholder="Số điện thoại"
            required
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            className="form-control"
            name="email"
            placeholder="Email"
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
          {loading ? "Đang xử lý..." : "Tạo tài khoản"}
        </button>
      </form>

      <div className="auth-switch">
        Đã có tài khoản? <a href="/login">Đăng nhập</a>
      </div>
    </>
  );
};

export default FormRegister;
