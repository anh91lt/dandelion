import axios from "axios";

const registerAPI = async (formData) => {
  try {
    await axios.post(
      process.env.REACT_APP_API_BASE_URL + "/register",
      formData
    );
    return { success: true, message: "Đăng ký thành công!" };
  } catch (error) {
    return { success: false, message: "Đăng ký thất bại. Hãy thử lại!" };
  }
};

export default registerAPI;
