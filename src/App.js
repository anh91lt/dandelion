// src/App.js
import React, { useContext } from "react";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";

import Home from "./pages/Home/Home";
import LoginPage from "./pages/Account/loginPage";
import RegisterPage from "./pages/Account/registerPage";

import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Policy from "./pages/Policy/Policy";
import Footer from "./pages/Footer/Footer";
import Header from "./pages/Header/Header";

import Life from "./pages/Life/Life";
import Travel from "./pages/Travel/Travel";
import Product from "./pages/Product/Product";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import TravelDetail from "./pages/TravelDetail/TravelDetail";
import LifeDetail from "./pages/LifeDetail/LifeDetail";

import ProductPage from "./Admin/pages/Product/productPage";
import LifePage from "./Admin/pages/Life/lifePage";
import TravelPage from "./Admin/pages/Travel/travelPage";

import NotFound from "./pages/NotFound/ErrorPage";
import { DataContext } from "./Provider/dataProvider";

function App() {
  // KHÔNG destructure thẳng để tránh lỗi khi context chưa sẵn sàng
  const ctx = useContext(DataContext);
  const isAuthed = !!ctx?.data;
  const isAdmin = ctx?.data?.role === "1";

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/policy" element={<Policy />} />

        {/* Login/Register: nếu đã đăng nhập -> về trang chủ */}
        <Route
          path="/login"
          element={!isAuthed ? <LoginPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/register"
          element={!isAuthed ? <RegisterPage /> : <Navigate to="/" replace />}
        />
        <Route path="/products" element={<Product />} />
        <Route path="/product/:id" element={<ProductDetail />} />

        <Route path="/life" element={<Life />} />
        <Route path="/life/:id" element={<LifeDetail />} />

        <Route path="/travel" element={<Travel />} />
        <Route path="/travel/:id" element={<TravelDetail />} />

        {/* ADMIN ROUTES - bảo vệ trực tiếp bằng Navigate, không cần file riêng */}
        <Route
          path="/adproduct"
          element={
            isAdmin ? <ProductPage /> : <Navigate to="/notfound" replace />
          }
        />
        <Route
          path="/adlife"
          element={isAdmin ? <LifePage /> : <Navigate to="/notfound" replace />}
        />
        <Route
          path="/adtravel"
          element={
            isAdmin ? <TravelPage /> : <Navigate to="/notfound" replace />
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
