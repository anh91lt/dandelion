import React, { useState } from "react";
import "./account.css";
import { notification } from "antd"; // Import notification từ antd
import loginAPI from "../../services/loginAPI";
import FormLogin from "../../components/Account/formLogin";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const [loading, setLoading] = useState(false); // Loading state cho nút

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      placement: "topRight", // Vị trí hiển thị thông báo
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await loginAPI(formData);
      // Nếu đăng nhập thành công
      if (result.success) {
        openNotification(
          "success",
          "Đăng nhập thành công",
          "Chào mừng bạn trở lại!"
        );
        localStorage.setItem("token", result.token);
        window.location.href = "/";
      } else {
        openNotification(
          "error",
          "Đăng nhập thất bại",
          result.message || "Vui lòng kiểm tra lại thông tin đăng nhập."
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      openNotification(
        "error",
        "Lỗi hệ thống",
        error.response?.data?.message || "Đã xảy ra lỗi khi đăng nhập."
      );
    } finally {
      setLoading(false); // Đảm bảo trạng thái loading được reset
    }
  };

  return (
    <div className="account-page">
      <div className="account-card">
        <FormLogin
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default LoginPage;
