import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import apiGetTokenClient from "../../middleWare/getTokenClient";
import "../../styles/productDetail.css";

const API = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";
const getData = (res) => res?.data?.result ?? res?.data ?? [];
const toDisplayUrl = (url) =>
  !url
    ? "/images/placeholder.png"
    : /^https?:|^data:/.test(url)
    ? url
    : `${API}${url}`;
const formatVND = (n) => `${Number(n || 0).toLocaleString("vi-VN")} VNĐ`;
const shortText = (s, len = 160) => {
  if (!s) return "";
  const t = String(s).replace(/\s+/g, " ").trim();
  return t.length > len ? t.slice(0, len - 1) + "…" : t;
};

export default function ProductDetail() {
  const { id } = useParams();
  const pid = String(id || "").trim();

  const [cats, setCats] = useState([]);
  const [details, setDetails] = useState([]);
  const [products, setProducts] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);

  // tải dữ liệu
  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const [rc, rd, rp] = await Promise.all([
          apiGetTokenClient.get(`${API}/category`),
          apiGetTokenClient.get(`${API}/detail-category`),
          apiGetTokenClient.get(`${API}/product`),
        ]);
        setCats(getData(rc));
        setDetails(getData(rd));
        const list = getData(rp);
        setProducts(list);

        // ảnh sản phẩm (nếu có bảng product-image)
        try {
          const ri = await apiGetTokenClient.get(`${API}/product-image`);
          setImages(getData(ri));
        } catch {
          // không có endpoint product-image -> bỏ qua, dùng ảnh chính
          setImages([]);
        }
      } catch (e) {
        console.error(e);
        setErr(
          e?.response?.data?.message || "Không tải được dữ liệu sản phẩm."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [pid]);

  // tìm sản phẩm theo id
  const product = useMemo(
    () => products.find((p) => String(p.id) === pid),
    [products, pid]
  );

  // ảnh gallery: ưu tiên product-image theo position; nếu không có dùng ảnh chính
  const gallery = useMemo(() => {
    const fromTable = images
      .filter(
        (im) => String(im.product_id) === pid || String(im.productId) === pid
      )
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .map((im) => ({ id: im.id, url: im.imageUrl, alt: im.alt }));

    if (fromTable.length > 0) return fromTable;
    if (product?.image)
      return [
        { id: "main", url: product.image, alt: product?.name || "image" },
      ];
    return [];
  }, [images, product, pid]);

  useEffect(() => {
    setActiveIdx(0);
  }, [pid, gallery.length]);

  const catName = useMemo(() => {
    if (!product) return "";
    const detail = details.find((d) => d.id === product.detail_categoryId);
    const cat = cats.find((c) => c.id === detail?.cate_productId);
    return cat?.name || "";
  }, [cats, details, product]);

  const detailName = useMemo(() => {
    if (!product) return "";
    const detail = details.find((d) => d.id === product.detail_categoryId);
    return detail?.name || "";
  }, [details, product]);

  // gợi ý cùng chuyên mục (related)
  const related = useMemo(() => {
    if (!product) return [];
    return products
      .filter(
        (p) =>
          p.id !== product.id &&
          p.detail_categoryId === product.detail_categoryId
      )
      .slice(0, 8);
  }, [products, product]);

  if (loading) {
    return <div className="pm-container">Đang tải chi tiết sản phẩm…</div>;
  }
  if (err) {
    return <div className="pm-container text-danger">{err}</div>;
  }
  if (!product) {
    return <div className="pm-container">Không tìm thấy sản phẩm.</div>;
  }

  const mainImg = gallery[activeIdx];

  return (
    <div className="pm-container">
      {/* Breadcrumb */}
      <nav className="pd-breadcrumb">
        <Link to="/products" className="pd-bc-link">
          Sản phẩm
        </Link>
        {catName && <span className="pd-bc-sep">/</span>}
        {catName && (
          <Link
            to={`/products?category=${encodeURIComponent(
              details.find((d) => d.id === product.detail_categoryId)
                ?.cate_productId || ""
            )}`}
            className="pd-bc-link"
          >
            {catName}
          </Link>
        )}
        {detailName && <span className="pd-bc-sep">/</span>}
        {detailName && (
          <Link
            to={`/products?detail=${encodeURIComponent(
              product.detail_categoryId
            )}`}
            className="pd-bc-link"
          >
            {detailName}
          </Link>
        )}
      </nav>

      {/* Layout */}
      <div className="pd-wrap">
        {/* Gallery */}
        <section className="pd-gallery card">
          <div className="card-body">
            <div className="pd-main">
              {mainImg ? (
                <img
                  src={toDisplayUrl(mainImg.url)}
                  alt={mainImg.alt || product.name}
                  className="pd-main-img"
                  loading="eager"
                />
              ) : (
                <div className="pd-main-empty">Chưa có ảnh</div>
              )}
            </div>

            {gallery.length > 1 && (
              <div className="pd-thumbs">
                {gallery.map((g, idx) => (
                  <button
                    key={g.id || idx}
                    className={`pd-thumb ${
                      idx === activeIdx ? "is-active" : ""
                    }`}
                    onClick={() => setActiveIdx(idx)}
                    aria-label={`Ảnh ${idx + 1}`}
                  >
                    <img src={toDisplayUrl(g.url)} alt={g.alt || ""} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Info */}
        <section className="pd-info card">
          <div className="card-body">
            <h1 className="pd-title">{product.name}</h1>
            {(catName || detailName) && (
              <div className="pd-meta">
                {catName && <span className="badge bg-primary">{catName}</span>}
                {detailName && (
                  <span className="badge bg-success">{detailName}</span>
                )}
              </div>
            )}

            <div className="pd-price">Giá: {formatVND(product.price)}</div>

            <div className="pd-spec">
              <div>
                <strong>Đơn vị:</strong> {product.unit || "—"}
              </div>
              <div>
                <strong>Quy cách:</strong>{" "}
                {product.amount
                  ? `${product.amount}${
                      product.unit_amount ? ` ${product.unit_amount}` : ""
                    }`
                  : "—"}
              </div>
              {product.manufacturer && (
                <div>
                  <strong>NSX:</strong> {product.manufacturer}
                </div>
              )}
              {product.link && (
                <div>
                  <strong>Tham khảo:</strong>{" "}
                  <a href={product.link} target="_blank" rel="noreferrer">
                    {product.link}
                  </a>
                </div>
              )}
            </div>

            {product.description && (
              <div className="pd-block">
                <div className="pd-block-title">Mô tả</div>
                <div className="pd-block-body">{product.description}</div>
              </div>
            )}

            {product.ingredient && (
              <div className="pd-block">
                <div className="pd-block-title">Thành phần</div>
                <div className="pd-block-body">{product.ingredient}</div>
              </div>
            )}

            {product.uses && (
              <div className="pd-block">
                <div className="pd-block-title">Công dụng</div>
                <div className="pd-block-body pre-wrap">{product.uses}</div>
              </div>
            )}

            {product.tutorial && (
              <div className="pd-block">
                <div className="pd-block-title">Cách dùng</div>
                <div className="pd-block-body pre-wrap">{product.tutorial}</div>
              </div>
            )}

            {product.preserve && (
              <div className="pd-block">
                <div className="pd-block-title">Bảo quản</div>
                <div className="pd-block-body pre-wrap">{product.preserve}</div>
              </div>
            )}

            {product.note && (
              <div className="pd-block">
                <div className="pd-block-title">Lưu ý</div>
                <div className="pd-block-body pre-wrap">{product.note}</div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="pf-section" style={{ marginTop: 28 }}>
          <div className="pf-head">
            <div className="pm-title" style={{ fontSize: 20 }}>
              Sản phẩm cùng chuyên mục
            </div>
            <a
              href={`/products?detail=${encodeURIComponent(
                product.detail_categoryId
              )}`}
              className="pf-more"
            >
              Xem tất cả →
            </a>
          </div>
          <div className="pf-grid">
            {related.map((p) => (
              <a
                key={p.id}
                href={`/product/${p.id}`}
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
                  {shortText(p.description, 120)}
                </div>
                <div className="pf-price">Giá: {formatVND(p.price)}</div>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
