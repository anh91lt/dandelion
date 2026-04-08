import React, { useState } from "react";
import "./account.css";
import { notification } from "antd"; // Import notification từ Ant Design
import FormRegister from "../../components/Account/formRegister";
import registerAPI from "../../services/registerAPI";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false); // Trạng thái tải
  const navigate = useNavigate();

  // Hàm mở notification từ Ant Design
  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      placement: "topRight", // Vị trí hiển thị thông báo
    });
  };

  // Xử lý thay đổi trong form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra nếu tất cả trường đều được điền
    if (!formData.username || !formData.email || !formData.password) {
      openNotification(
        "warning",
        "Thông báo",
        "Vui lòng điền đầy đủ thông tin."
      );
      return;
    }

    setLoading(true);

    try {
      const result = await registerAPI(formData);

      if (result.success) {
        openNotification(
          "success",
          "Đăng ký thành công",
          result.message || "Tài khoản của bạn đã được tạo."
        );
        navigate("/login"); // Chuyển hướng về trang chính
      } else {
        openNotification(
          "error",
          "Đăng ký thất bại",
          result.message || "Đã xảy ra lỗi khi đăng ký."
        );
      }
    } catch (error) {
      console.error("Registration error:", error);
      openNotification(
        "error",
        "Lỗi hệ thống",
        error.response?.data?.message || "Đã xảy ra lỗi không xác định."
      );
    } finally {
      setLoading(false); // Đảm bảo trạng thái tải được reset
    }
  };

  return (
    <div className="account-page">
      <div className="account-card">
        <FormRegister
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default RegisterPage;
