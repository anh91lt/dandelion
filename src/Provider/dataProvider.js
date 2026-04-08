// src/Provider/dataProvider.jsx
import React, { createContext, useLayoutEffect, useState } from "react";
import decodedJWT from "../middleWare/decodedJWT";

export const DataContext = createContext({
  data: null,
  setData: () => {},
  ready: false,
});

export const DataProvider = ({ children }) => {
  // đọc token đồng bộ cho lần render đầu tiên để tránh nháy
  const [data, setData] = useState(() => decodedJWT());
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    // bảo đảm đồng bộ lại (phòng khi decodedJWT phụ thuộc môi trường)
    setData(decodedJWT());
    setReady(true);

    // nếu đăng nhập/đăng xuất ở tab khác -> đồng bộ
    const onStorage = (e) => {
      if (e.key === "token") {
        setData(decodedJWT());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <DataContext.Provider value={{ data, setData, ready }}>
      {children}
    </DataContext.Provider>
  );
};
