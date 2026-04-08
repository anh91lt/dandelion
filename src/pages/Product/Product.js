// src/pages/Product.js
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import apiGetTokenClient from "../../middleWare/getTokenClient";

const API = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";

const getData = (res) => res?.data?.result ?? res?.data ?? [];
const toDisplayUrl = (url) =>
  !url
    ? "/images/placeholder.png"
    : /^https?:|^data:/.test(url)
    ? url
    : `${API}${url}`;
const formatVND = (n) => `${Number(n || 0).toLocaleString("vi-VN")} VNĐ`;
const slugify = (s = "") =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
const shortText = (s, len = 140) => {
  if (!s) return "";
  const t = String(s).replace(/\s+/g, " ").trim();
  return t.length > len ? t.slice(0, len - 1) + "…" : t;
};
const normalize = (s = "") =>
  String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const eq = (a, b) => String(a) === String(b);

// ===== helpers cho anchor =====
const catIdFromName = (name = "") => `cat-${slugify(name)}`;
const catHrefFromName = (name = "") => `/products#${catIdFromName(name)}`;

export default function Product() {
  // ===== data =====
  const [cats, setCats] = useState([]);
  const [details, setDetails] = useState([]);
  const [products, setProducts] = useState([]);

  // ===== URL search params =====
  const [searchParams, setSearchParams] = useSearchParams();
  const qParam = searchParams.get("q") || "";
  const catParam = searchParams.get("category") || "";
  const detParam = searchParams.get("detail") || "";

  // ===== local UI state (filter form) =====
  const [q, setQ] = useState(qParam);
  const [catId, setCatId] = useState(catParam);
  const [detailId, setDetailId] = useState(detParam);

  // keep UI state in sync if URL changes (vd: dùng ô search ở Header)
  useEffect(() => {
    setQ(qParam);
    setCatId(catParam);
    setDetailId(detParam);
  }, [qParam, catParam, detParam]);

  // ===== fetch =====
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let canceled = false;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const [rc, rd, rp] = await Promise.all([
          apiGetTokenClient.get(`${API}/category`),
          apiGetTokenClient.get(`${API}/detail-category`),
          apiGetTokenClient.get(`${API}/product`),
        ]);
        if (canceled) return;
        setCats(getData(rc).sort((a, b) => Number(a.id) - Number(b.id)));
        setDetails(getData(rd).sort((a, b) => Number(a.id) - Number(b.id)));
        setProducts(getData(rp).sort((a, b) => Number(a.id) - Number(b.id)));
      } catch (e) {
        if (canceled) return;
        console.error(e);
        setErr(
          e?.response?.data?.message || "Không tải được dữ liệu sản phẩm."
        );
      } finally {
        if (!canceled) setLoading(false);
      }
    })();
    return () => {
      canceled = true;
    };
  }, []);

  // ===== maps & helpers =====
  const detailIdsByCat = useMemo(() => {
    const m = new Map();
    for (const d of details) {
      const key = String(d.cate_productId);
      const arr = m.get(key) || [];
      arr.push(String(d.id));
      m.set(key, arr);
    }
    return m;
  }, [details]);

  // chi tiết theo category đang chọn (cho dropdown)
  const detailOptions = useMemo(() => {
    if (!catId) return details;
    return details.filter((d) => eq(d.cate_productId, catId));
  }, [details, catId]);

  // ===== filtering =====
  const filteredProducts = useMemo(() => {
    // nếu có tham số detail -> ưu tiên lọc theo detail
    let list = products;

    if (detParam) {
      list = list.filter((p) => eq(p.detail_categoryId, detParam));
    } else if (catParam) {
      const dIds = detailIdsByCat.get(String(catParam)) || [];
      list = list.filter((p) => dIds.includes(String(p.detail_categoryId)));
    }

    if (qParam.trim()) {
      const key = normalize(qParam.trim());
      list = list.filter((p) => normalize(p.name).includes(key));
    }
    return list;
  }, [products, detParam, catParam, qParam, detailIdsByCat]);

  // group by category (dùng khi KHÔNG có tham số lọc nào)
  const productsByCat = useMemo(() => {
    const m = new Map();
    for (const cat of cats) {
      const dIds = detailIdsByCat.get(String(cat.id)) || [];
      m.set(
        String(cat.id),
        products.filter((p) => dIds.includes(String(p.detail_categoryId)))
      );
    }
    return m;
  }, [cats, detailIdsByCat, products]);

  // ===== actions =====
  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    if (q.trim()) next.q = q.trim();
    if (catId) next.category = catId;
    if (detailId) next.detail = detailId;
    setSearchParams(next);
  };

  const handleClear = () => {
    setQ("");
    setCatId("");
    setDetailId("");
    setSearchParams({});
  };

  // khi đổi category trong form -> reset detail nếu detail không thuộc cat
  useEffect(() => {
    if (!catId) return;
    if (detailId && !detailOptions.some((d) => eq(d.id, detailId))) {
      setDetailId("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catId]);

  // ===== click mục lục: xử lý filtered vs grouped =====
  const handleCatalogClick = (name) => (e) => {
    const id = catIdFromName(name);
    const href = `/products#${id}`;
    const isFiltered = Boolean(qParam || catParam || detParam);
    const onProducts = window.location.pathname === "/products";

    // Nếu đang filtered -> xoá params, set hash, chờ effect cuộn sau khi grouped render
    if (isFiltered) {
      e.preventDefault();
      setSearchParams({});
      window.history.pushState(null, "", href);
      return;
    }

    // Đã grouped
    if (onProducts) {
      e.preventDefault();
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      window.history.replaceState(null, "", href);
    }
    // Nếu không ở /products thì để anchor mặc định điều hướng
  };

  // ===== sau khi chuyển từ filtered -> grouped hoặc mở trực tiếp /products#... =====
  useEffect(() => {
    if (loading || err) return;
    const isFiltered = Boolean(qParam || catParam || detParam);
    if (isFiltered) return;

    const hash = window.location.hash;
    if (!hash) return;
    const id = hash.slice(1);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [loading, err, qParam, catParam, detParam, cats, products]);

  // ===== render =====
  return (
    <>
      <main className="product-main">
        <div className="container">
          {/* Sidebar mục lục category */}
          <aside className="sidebar">
            {loading ? (
              <div className="product-catalog">Đang tải mục lục…</div>
            ) : err ? (
              <div className="product-catalog text-danger">{err}</div>
            ) : (
              <ul className="product-catalog">
                {cats.map((c) => (
                  <li key={c.id}>
                    <a
                      href={catHrefFromName(c.name)} // /products#cat-<slug>
                      onClick={handleCatalogClick(c.name)}
                    >
                      {c.name}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </aside>

          <div className="main-content">
            {/* ===== Filter bar ===== */}
            <form
              className="card"
              style={{ padding: 12, marginBottom: 16, borderRadius: 12 }}
              onSubmit={handleSubmit}
            >
              <div
                className="row g-2"
                style={{ alignItems: "center", margin: 0 }}
              >
                <div className="col-12 col-md-4">
                  <input
                    className="form-control"
                    placeholder="Tìm theo tên sản phẩm…"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                  />
                </div>
                <div className="col-6 col-md-3">
                  <select
                    className="form-select"
                    value={catId}
                    onChange={(e) => setCatId(e.target.value)}
                  >
                    <option value="">— Tất cả Category —</option>
                    {cats.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-6 col-md-3">
                  <select
                    className="form-select"
                    value={detailId}
                    onChange={(e) => setDetailId(e.target.value)}
                    disabled={!catId && detailOptions.length === 0}
                  >
                    <option value="">— Tất cả Detail —</option>
                    {detailOptions.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-2 d-flex" style={{ gap: 8 }}>
                  <button className="btn btn-primary w-100" type="submit">
                    Tìm kiếm
                  </button>
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={handleClear}
                    title="Xoá bộ lọc"
                  >
                    Xoá
                  </button>
                </div>
              </div>
            </form>

            {/* ===== content ===== */}
            {loading && <div className="my-3">Đang tải sản phẩm…</div>}
            {err && !loading && <div className="my-3 text-danger">{err}</div>}

            {/* Nếu có tham số lọc -> hiển thị một section kết quả */}
            {!loading && !err && (qParam || catParam || detParam) ? (
              <section style={{ marginTop: 16 }}>
                <h2 className="title">
                  Kết quả lọc
                  {catParam &&
                    ` · ${
                      cats.find((c) => eq(c.id, catParam))?.name || "Category"
                    }`}
                  {detParam &&
                    ` · ${
                      details.find((d) => eq(d.id, detParam))?.name || "Detail"
                    }`}
                  {qParam && ` · Tên ~ “${qParam}”`}
                </h2>

                <div className="pf-grid">
                  {filteredProducts.length === 0 && (
                    <div style={{ padding: 12, color: "#666" }}>
                      Không tìm thấy sản phẩm phù hợp.
                    </div>
                  )}
                  {filteredProducts.map((p) => (
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
                        {shortText(p.description, 140)}
                      </div>
                      <div className="pf-price">Giá: {formatVND(p.price)}</div>
                    </a>
                  ))}
                </div>
              </section>
            ) : (
              // Ngược lại: không có tham số lọc -> nhóm theo Category
              !loading &&
              !err &&
              cats.map((cat) => {
                const sid = catIdFromName(cat.name);
                const list = productsByCat.get(String(cat.id)) || [];
                return (
                  <section id={sid} key={cat.id} style={{ marginTop: 30 }}>
                    <h2 className="title">{cat.name}</h2>
                    <div className="pf-grid">
                      {list.length === 0 && (
                        <div style={{ padding: 12, color: "#666" }}>
                          Chưa có sản phẩm cho mục này.
                        </div>
                      )}

                      {list.map((p) => (
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
                          <div className="pf-name pf-name--lg line-2">
                            {p.name}
                          </div>
                          <div className="pf-desc line-3">
                            {shortText(p.description, 140)}
                          </div>
                          <div className="pf-price">
                            Giá: {formatVND(p.price)}
                          </div>
                        </a>
                      ))}
                    </div>
                  </section>
                );
              })
            )}
          </div>
        </div>
      </main>
    </>
  );
}
