// src/layouts/Header.jsx
import React, { useEffect, useMemo, useState, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/header.css";
import apiGetTokenClient from "../../middleWare/getTokenClient";
import { DataContext } from "../../Provider/dataProvider";

const API = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";

// Hàm bổ trợ: Đảm bảo dữ liệu trả về luôn là một mảng để tránh lỗi .map() hoặc for...of
const getData = (res) => {
  const result = res?.data?.result ?? res?.data;
  return Array.isArray(result) ? result : [];
};

export default function Header() {
  const navigate = useNavigate();

  // Context user
  const { data, setData } = useContext(DataContext);
  const isLoggedIn = Boolean(data);
  const isAdmin = String(data?.role) === "1";

  const [cats, setCats] = useState([]);
  const [details, setDetails] = useState([]);
  const [err, setErr] = useState("");
  const [keyword, setKeyword] = useState("");

  // Dropdown “Quản lý”
  const [adminOpen, setAdminOpen] = useState(false);
  const adminRef = useRef(null);

  // Load danh mục
  useEffect(() => {
    (async () => {
      try {
        const [rc, rd] = await Promise.all([
          apiGetTokenClient.get(`${API}/category`),
          apiGetTokenClient.get(`${API}/detail-category`),
        ]);
        setCats(getData(rc));
        setDetails(getData(rd));
      } catch (e) {
        console.error("Lỗi tải danh mục:", e);
        setErr("Không tải được danh mục sản phẩm.");
      }
    })();
  }, []);

  // Map detail theo cat (Đã sửa lỗi "is not iterable")
  const detailsByCat = useMemo(() => {
    const m = new Map();
    
    // Kiểm tra an toàn trước khi lặp
    if (!Array.isArray(details)) return m;

    for (const d of details) {
      if (d && d.cate_productId) {
        const arr = m.get(d.cate_productId) || [];
        arr.push(d);
        m.set(d.cate_productId, arr);
      }
    }
    return m;
  }, [details]);

  // Search
  const onSearchSubmit = (e) => {
    e.preventDefault();
    const q = keyword.trim();
    if (!q) navigate("/products");
    else navigate(`/products?q=${encodeURIComponent(q)}`);
    setKeyword("");
  };
  const onSearchClear = () => setKeyword("");

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setData(null);
    setAdminOpen(false);
    navigate("/");
  };

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (adminRef.current && !adminRef.current.contains(e.target)) {
        setAdminOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") setAdminOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <header className="header">
      <div className="container">
        {/* PHIÊN BẢN PC */}
        <div className="pc">
          <div className="header-main">
            <Link to="/">
              <img
                className="logo"
                src="/logo/Kimanhshop.png"
                alt="Kimanhshop"
              />
            </Link>

            {/* NAVBAR PC */}
            <nav className="navbar_pc">
              <ul className="navbar-list">
                <li className="navbar-item">
                  <Link to="/products" className="link">
                    SẢN PHẨM
                  </Link>

                  <div className="navbar-content">
                    <div className="row">
                      {err && (
                        <div style={{ padding: 12, color: "crimson" }}>
                          {err}
                        </div>
                      )}

                      {!err && cats.map((cat) => (
                        <div className="column" key={cat.id}>
                          <Link
                            to={`/products?category=${encodeURIComponent(cat.id)}`}
                            className="nav-cat fw-bold"
                            title={cat.name}
                          >
                            {cat.name}
                          </Link>

                          {(detailsByCat.get(cat.id) || []).map((d) => (
                            <Link
                              key={d.id}
                              to={`/products?category=${encodeURIComponent(cat.id)}&detail=${encodeURIComponent(d.id)}`}
                              className="nav-detail-link"
                              title={d.name}
                            >
                              {d.name}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </li>

                <li className="navbar-item">
                  <Link to="/travel" className="link">DU LỊCH</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/life" className="link">CUỘC SỐNG</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/contact" className="link">LIÊN HỆ</Link>
                </li>
              </ul>
            </nav>

            {/* SEARCH AREA */}
            <div className="search_area">
              <form id="search-form-id" className="search-form" onSubmit={onSearchSubmit}>
                <input
                  type="text"
                  className="search-form__input"
                  placeholder="Tìm kiếm sản phẩm..."
                  autoComplete="off"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <button type="submit" className="search-form__btn">
                  <img className="search_icon" src="/icons/search.svg" alt="search" />
                </button>
                <button
                  type="reset"
                  className="search-form__clear"
                  onClick={onSearchClear}
                  style={{ visibility: keyword ? "visible" : "hidden" }}
                >
                  <img className="clear_icon" src="/icons/clear-thin.svg" alt="clear" />
                </button>
              </form>
            </div>

            {/* AUTH & ADMIN AREA */}
            <div className="buttons auth-area">
              {isAdmin && (
                <div className={`admin-menu ${adminOpen ? "is-open" : ""}`} ref={adminRef}>
                  <button
                    type="button"
                    className="admin-toggle"
                    onClick={() => setAdminOpen((v) => !v)}
                  >
                    Quản lý <span className="admin-caret">▾</span>
                  </button>

                  <div className="admin-dropdown" role="menu">
                    <Link to="/adproduct" className="admin-dd-item" onClick={() => setAdminOpen(false)}>Sản phẩm</Link>
                    <Link to="/adlife" className="admin-dd-item" onClick={() => setAdminOpen(false)}>Cuộc sống</Link>
                    <Link to="/adtravel" className="admin-dd-item" onClick={() => setAdminOpen(false)}>Du lịch</Link>
                  </div>
                </div>
              )}

              {!isLoggedIn ? (
                <Link to="/login" className="sign-in">ĐĂNG NHẬP</Link>
              ) : (
                <>
                  <h2 style={{ color: "#fff", fontSize: 14, margin: "0 10px" }}>
                    Chào, {data?.username ?? "bạn"}
                  </h2>
                  <button onClick={handleLogout} className="sign-in logout-btn">ĐĂNG XUẤT</button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* PHIÊN BẢN MOBILE */}
        <div className="mobile">
          <div className="mobile-header-main">
            <label className="navbar_mobile-btn1" htmlFor="nav-mobile-input">
              <img className="navbar_mobile-btn" src="/icons/bars-solid.svg" alt="menu" />
            </label>
            <input type="checkbox" hidden id="nav-mobile-input" className="nav-input" />
            <label htmlFor="nav-mobile-input" className="nav_overlay"></label>

            <Link to="/">
              <img className="logo" src="/logo/Kimanhshop.png" alt="Kimanhshop" />
            </Link>

            <nav className="navbar_mobile">
              <label htmlFor="nav-mobile-input" className="navbar_mobile-close">
                <img className="navbar_mobile-close" src="/icons/xmark-solid.svg" alt="close" />
              </label>

              <ul className="navbar_mobile-list">
                <li className="navbar_mobile-item">
                  <Link to="/products" className="link">THÔNG TIN SẢN PHẨM</Link>
                  <div className="navbar_mobile-content">
                    {!err && cats.map((cat) => (
                      <div className="column" key={cat.id}>
                        <Link to={`/products?category=${cat.id}`} className="nav-cat fw-bold">{cat.name}</Link>
                        {(detailsByCat.get(cat.id) || []).map((d) => (
                          <Link key={d.id} to={`/products?category=${cat.id}&detail=${d.id}`} className="nav-detail-link">
                            {d.name}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                </li>
                <li className="navbar_mobile-item"><Link to="/life" className="link">CUỘC SỐNG</Link></li>
                <li className="navbar_mobile-item"><Link to="/travel" className="link">DU LỊCH</Link></li>
                <li className="navbar_mobile-item"><Link to="/contact" className="link">LIÊN HỆ</Link></li>
                
                {isAdmin && (
                  <li className="navbar_mobile-item">
                    <details className="mobile-admin">
                      <summary style={{ padding: "10px 20px", fontWeight: "bold" }}>QUẢN LÝ</summary>
                      <Link to="/adproduct" className="nav-detail-link" style={{ paddingLeft: 40 }}>Sản phẩm</Link>
                      <Link to="/adlife" className="nav-detail-link" style={{ paddingLeft: 40 }}>Cuộc sống</Link>
                      <Link to="/adtravel" className="nav-detail-link" style={{ paddingLeft: 40 }}>Du lịch</Link>
                    </details>
                  </li>
                )}
              </ul>

              <div className="mobile-auth" style={{ padding: 20 }}>
                <h2 style={{ fontSize: 14, marginBottom: 15 }}>
                  XIN CHÀO, {data?.username?.toUpperCase() ?? "BẠN"}
                </h2>
                {!isLoggedIn ? (
                  <Link to="/login" className="mobile-sign-in">Đăng nhập</Link>
                ) : (
                  <button onClick={handleLogout} className="mobile-sign-in">Đăng xuất</button>
                )}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}