import React, { useEffect, useRef } from "react";
import axios from "axios";
import { notification } from "antd";
import { loadGoogleScript } from "../utils/loadGoogle";

const API = process.env.REACT_APP_API_BASE_URL;
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

export default function GoogleLoginButton() {
  const btnRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await loadGoogleScript();
        if (cancelled || !window.google || !btnRef.current) return;

        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          ux_mode: "popup", // hoặc "redirect"
          auto_select: false,
          callback: async (resp) => {
            try {
              const r = await axios.post(`${API}/login/google`, {
                credential: resp.credential, // <-- id_token
              });

              if (r.data?.success) {
                localStorage.setItem("token", r.data.token);
                notification.success({
                  message: "Đăng nhập Google thành công",
                });
                window.location.href = "/";
              } else {
                notification.error({
                  message: "Đăng nhập thất bại",
                  description: r.data?.message || "Không xác định",
                });
              }
            } catch (err) {
              notification.error({
                message: "Lỗi máy chủ",
                description: err?.response?.data?.message || String(err),
              });
            }
          },
        });

        // Render button theo guideline của Google (được phép custom nhẹ)
        window.google.accounts.id.renderButton(btnRef.current, {
          theme: "outline",
          size: "large",
          shape: "pill",
          text: "continue_with", // "signin_with"
          width: 320, // có thể để "100%" nếu container co giãn
        });

        // Optional: hiển thị One Tap
        // window.google.accounts.id.prompt();
      } catch (e) {
        console.error("Load Google script failed:", e);
      }
    })();

    return () => {
      cancelled = true;
      if (window.google?.accounts?.id) window.google.accounts.id.cancel();
    };
  }, []);

  return (
    <div ref={btnRef} style={{ display: "flex", justifyContent: "center" }} />
  );
}
