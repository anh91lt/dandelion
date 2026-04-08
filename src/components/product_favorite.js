import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiGetTokenClient from "../middleWare/getTokenClient";
import "../Admin/styles/productPage.css";

/** Base API đúng port 3001 */
const API = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";

/** lấy data từ response (hỗ trợ {result:[]} hoặc mảng trực tiếp) */
const getData = (res) => res?.data?.result ?? res?.data ?? [];

/** render ảnh: nếu là relative (/Uploads/...) => ghép host 3001 */
const toDisplayUrl = (url) =>
  !url
    ? "/images/placeholder.png"
    : /^https?:|^data:/.test(url)
    ? url
    : `${API}${url}`;

const formatVND = (n) => `${Number(n || 0).toLocaleString("vi-VN")} VNĐ`;

/** cắt gọn mô tả */
const shortText = (s, len = 140) => {
  if (!s) return "";
  const t = String(s).replace(/\s+/g, " ").trim();
  return t.length > len ? t.slice(0, len - 1) + "…" : t;
};

/**
 * Section sản phẩm dùng lại (card giống hệt Product.js)
 * Props:
 *  - title: tiêu đề section (tuỳ chọn)
 *  - viewAllHref: link “Đọc thêm →” (bỏ trống để ẩn)
 *  - limit: số item hiển thị (mặc định 8)
 *  - detailCategoryId: lọc theo detail_categoryId (tuỳ chọn)
 *  - className: class ngoài cùng (tuỳ chọn)
 *  - descLen: ký tự mô tả (mặc định 140 — giống Product.js)
 */
export default function ProductFavorite({
  title = "",
  viewAllHref = "",
  limit = 8,
  detailCategoryId = "",
  className = "",
  descLen = 140,
}) {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await apiGetTokenClient.get(`${API}/product`);
        let data = getData(res);

        if (detailCategoryId) {
          data = data.filter((p) => p.detail_categoryId === detailCategoryId);
        }

        if (alive) setItems(data.slice(0, limit));
      } catch (e) {
        if (alive)
          setErr(e?.response?.data?.message || "Không tải được sản phẩm.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [limit, detailCategoryId]);

  return (
    <section className={className}>
      {(title || viewAllHref) && (
        <div className="pf-head">
          {title && <h2 className="title">{title}</h2>}
          {viewAllHref && (
            <Link className="pf-more" to={viewAllHref}>
              Đọc thêm →
            </Link>
          )}
        </div>
      )}

      {loading && <div className="pf-grid">Đang tải sản phẩm…</div>}
      {!loading && err && <div className="pf-grid text-danger">{err}</div>}

      {!loading && !err && (
        <div className="pf-grid">
          {items.length === 0 && <div>Chưa có sản phẩm.</div>}

          {items.map((p) => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              className="pf-card"
              title={p.name}
            >
              <img
                className="pf-img pf-img--lg"
                src={toDisplayUrl(p.image)}
                alt={p.name || "Sản phẩm"}
                loading="lazy"
              />
              <div className="pf-name pf-name--lg line-2">{p.name}</div>
              <div className="pf-desc line-3">
                {shortText(p.description, descLen)}
              </div>
              <div className="pf-price">Giá: {formatVND(p.price)}</div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
