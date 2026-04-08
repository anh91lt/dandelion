import { jwtDecode } from "jwt-decode";

const decodedJWT = () => {
  const token = localStorage.getItem("token");
  if (!token || typeof token !== "string") return null; // im lặng khi chưa có token
  try {
    return jwtDecode(token);
  } catch (error) {
    // tránh console.error gây ồn trong flow bình thường
    console.warn("Token decode failed:", error?.message || error);
    return null;
  }
};

export default decodedJWT;
