import axios from "axios";

// Tạo một instance axios
const apiGetTokenClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // Đặt URL cơ sở cho API của bạn
});

// Thêm interceptor để thêm token vào header của mỗi yêu cầu
apiGetTokenClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Lấy token từ localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Thêm token vào header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiGetTokenClient;
