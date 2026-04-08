// src/services/loginAPI.js
import axios from "axios";

const loginAPI = async (formData) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/login`,
      {
        username: formData.usernameOrEmail, // <-- thống nhất
        password: formData.password, // <-- thống nhất
      }
    );

    return {
      success: true,
      message: res.data?.message,
      token: res.data?.token,
      data: res.data?.data,
    };
  } catch (error) {
    console.error("Đăng nhập thất bại!", error);
    return {
      success: false,
      message: error?.response?.data?.message || "Đăng nhập thất bại",
    };
  }
};

export default loginAPI;
