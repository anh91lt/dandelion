// src/pages/productPage.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import apiGetTokenClient from "../../../middleWare/getTokenClient";
import "../../styles/admin.css";

/** Base API đúng port 3001 */
const API = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";
const UPLOAD_URL =
  process.env.REACT_APP_UPLOAD_URL || `${API}/upload-image/product`;

/** lấy data từ response (hỗ trợ {result:[]} hoặc mảng trực tiếp) */
const getData = (res) => res?.data?.result ?? res?.data ?? [];

/** render ảnh: nếu là relative (/Uploads/...) => ghép host 3001 */
const toDisplayUrl = (url) =>
  !url ? "" : /^https?:|^data:/.test(url) ? url : `${API}${url}`;

export default function ProductPage() {
  // ==== STATE nguồn dữ liệu ====
  const [categories, setCategories] = useState([]);
  const [details, setDetails] = useState([]);
  const [products, setProducts] = useState([]);
  const [images, setImages] = useState([]);

  // ==== chọn / điều hướng ====
  const [selectedCat, setSelectedCat] = useState("");
  const [selectedDetail, setSelectedDetail] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");

  // dropdown chọn sản phẩm để quản lý ảnh (é‌p dạng number/null để không lệch kiểu)
  const [imgProductId, setImgProductId] = useState(null);

  // Thu gọn/mở rộng danh sách sản phẩm
  const [collapsed, setCollapsed] = useState(false);

  // ==== forms ====
  const [catName, setCatName] = useState("");
  const [detailName, setDetailName] = useState("");

  // form sản phẩm: đầy đủ các field
  const [prodForm, setProdForm] = useState({
    name: "",
    price: "",
    unit: "",
    amount: "",
    unit_amount: "",
    image: "",
    description: "",
    ingredient: "",
    uses: "",
    tutorial: "",
    note: "",
    preserve: "",
    manufacturer: "",
    link: "",
  });
  const [coverFile, setCoverFile] = useState(null); // file ảnh cover (nếu upload)

  // trạng thái sửa
  const [editingId, setEditingId] = useState(null);

  // form ảnh: chỉ upload file, alt/position chung
  const [imgFiles, setImgFiles] = useState([]); // Array<File>
  const [imgAlt, setImgAlt] = useState("");
  const [imgStartPos, setImgStartPos] = useState(0);

  // PREVIEW cho ảnh đang chọn
  const [imgPreviews, setImgPreviews] = useState([]); // string[] objectURL

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const imgCardRef = useRef(null);
  const productFormRef = useRef(null);

  // Tạo / cleanup objectURL preview mỗi khi imgFiles đổi
  useEffect(() => {
    const urls = imgFiles.map((f) => URL.createObjectURL(f));
    setImgPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [imgFiles]);

  // ==== LOADERS ====
  const loadCategories = async () => {
    const res = await apiGetTokenClient.get(`${API}/category`);
    setCategories(getData(res));
  };
  const loadDetails = async () => {
    const res = await apiGetTokenClient.get(`${API}/detail-category`);
    setDetails(getData(res));
  };
  const loadProducts = async () => {
    const res = await apiGetTokenClient.get(`${API}/product`);
    setProducts(getData(res));
  };
  const loadImages = async () => {
    const res = await apiGetTokenClient.get(`${API}/product-image`);
    setImages(getData(res));
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        await Promise.all([
          loadCategories(),
          loadDetails(),
          loadProducts(),
          loadImages(),
        ]);
      } catch (e) {
        console.error(e);
        setErr(
          `Không tải được dữ liệu (${e?.response?.status || "??"}). ${
            e?.response?.data?.message || e.message || ""
          }`
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ==== list theo chọn ====
  const detailsOfCat = useMemo(
    () => details.filter((d) => d.cate_productId === selectedCat),
    [details, selectedCat]
  );
  const productsOfDetail = useMemo(
    () => products.filter((p) => p.detail_categoryId === selectedDetail),
    [products, selectedDetail]
  );
  const imagesOfSelectedForImage = useMemo(
    () =>
      images
        .filter((im) => Number(im.product_id) === Number(imgProductId))
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0)),
    [images, imgProductId]
  );

  // Reset khi đổi chi tiết
  useEffect(() => {
    setSelectedProduct("");
    setImgProductId(null);
    setEditingId(null);
    setProdForm({
      name: "",
      price: "",
      unit: "",
      amount: "",
      unit_amount: "",
      image: "",
      description: "",
      ingredient: "",
      uses: "",
      tutorial: "",
      note: "",
      preserve: "",
      manufacturer: "",
      link: "",
    });
    setCoverFile(null);
    setImgFiles([]);
  }, [selectedDetail]);

  // ==== CATEGORY ====
  const addCategory = async () => {
    if (!catName.trim()) return;
    setLoading(true);
    try {
      await apiGetTokenClient.post(`${API}/category`, { name: catName.trim() });
      setCatName("");
      await loadCategories();
    } catch (e) {
      console.error(e);
      setErr(e?.response?.data?.message || "Không thêm được Loại sản phẩm.");
    } finally {
      setLoading(false);
    }
  };
  const deleteCategory = async (id) => {
    if (!window.confirm("Xoá loại sản phẩm này?")) return;
    setLoading(true);
    try {
      await apiGetTokenClient.delete(`${API}/category`, { data: { id } });
      if (selectedCat === id) {
        setSelectedCat("");
        setSelectedDetail("");
        setSelectedProduct("");
        setImgProductId(null);
      }
      await Promise.all([loadCategories(), loadDetails(), loadProducts()]);
    } catch (e) {
      console.error(e);
      setErr(e?.response?.data?.message || "Không xoá được Loại sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  // ==== DETAIL CATEGORY ====
  const addDetail = async () => {
    if (!detailName.trim() || !selectedCat)
      return alert("Chọn Loại sản phẩm và nhập tên chi tiết.");
    setLoading(true);
    try {
      await apiGetTokenClient.post(`${API}/detail-category`, {
        name: detailName.trim(),
        cate_productId: selectedCat,
      });
      setDetailName("");
      await loadDetails();
    } catch (e) {
      console.error(e);
      setErr(
        e?.response?.data?.message || "Không thêm được Chi tiết loại sản phẩm."
      );
    } finally {
      setLoading(false);
    }
  };
  const deleteDetail = async (id) => {
    if (!window.confirm("Xoá chi tiết loại này?")) return;
    setLoading(true);
    try {
      await apiGetTokenClient.delete(`${API}/detail-category`, {
        data: { id },
      });
      if (selectedDetail === id) {
        setSelectedDetail("");
        setSelectedProduct("");
        setImgProductId(null);
      }
      await Promise.all([loadDetails(), loadProducts()]);
    } catch (e) {
      console.error(e);
      setErr(e?.response?.data?.message || "Không xoá được Chi tiết loại.");
    } finally {
      setLoading(false);
    }
  };

  // ==== PRODUCT: ADD / EDIT ====
  const resetProductForm = () => {
    setProdForm({
      name: "",
      price: "",
      unit: "",
      amount: "",
      unit_amount: "",
      image: "",
      description: "",
      ingredient: "",
      uses: "",
      tutorial: "",
      note: "",
      preserve: "",
      manufacturer: "",
      link: "",
    });
    setCoverFile(null);
    setEditingId(null);
  };

  const addOrUpdateProduct = async () => {
    if (!selectedDetail) return alert("Chọn Chi tiết loại trước.");
    if (!prodForm.name.trim()) return alert("Nhập tên sản phẩm.");

    setLoading(true);
    setErr("");
    try {
      // Nếu có chọn file cover -> upload trước
      let coverUrl = prodForm.image;
      if (coverFile) {
        const fd = new FormData();
        fd.append("image", coverFile);
        const up = await axios.post(UPLOAD_URL, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        coverUrl = up?.data?.imageUrl || coverUrl;
      }

      const payload = {
        id: editingId || undefined, // khi PUT thì gửi id, POST thì bỏ
        name: prodForm.name.trim(),
        description: prodForm.description ?? "",
        price: Number(prodForm.price) || 0,
        unit: prodForm.unit ?? "",
        amount: prodForm.amount ?? "",
        unit_amount: prodForm.unit_amount ?? "",
        ingredient: prodForm.ingredient ?? "",
        uses: prodForm.uses ?? "",
        tutorial: prodForm.tutorial ?? "",
        note: prodForm.note ?? "",
        preserve: prodForm.preserve ?? "",
        manufacturer: prodForm.manufacturer ?? "",
        link: prodForm.link ?? "",
        image: coverUrl ?? "",
        detail_categoryId: selectedDetail,
      };

      if (editingId) {
        await apiGetTokenClient.put(`${API}/product`, payload);
      } else {
        await apiGetTokenClient.post(`${API}/product`, payload);
      }

      resetProductForm();
      await loadProducts();
    } catch (e) {
      console.error(e);
      setErr(
        e?.response?.data?.message ||
          (editingId
            ? "Không cập nhật được Sản phẩm."
            : "Không thêm được Sản phẩm.")
      );
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setProdForm({
      name: p.name || "",
      price: p.price ?? "",
      unit: p.unit || "",
      amount: p.amount || "",
      unit_amount: p.unit_amount || "",
      image: p.image || "",
      description: p.description || "",
      ingredient: p.ingredient || "",
      uses: p.uses || "",
      tutorial: p.tutorial || "",
      note: p.note || "",
      preserve: p.preserve || "",
      manufacturer: p.manufacturer || "",
      link: p.link || "",
    });
    setCoverFile(null);
    setTimeout(() => {
      productFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Xoá sản phẩm này?")) return;
    setLoading(true);
    try {
      await apiGetTokenClient.delete(`${API}/product`, { data: { id } });
      if (selectedProduct === id) setSelectedProduct("");
      if (Number(imgProductId) === Number(id)) setImgProductId(null);
      if (editingId === id) resetProductForm();
      await Promise.all([loadProducts(), loadImages()]);
    } catch (e) {
      console.error(e);
      setErr(e?.response?.data?.message || "Không xoá được Sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  // ==== PRODUCT IMAGE (upload nhiều ảnh) ====
  const addProductImages = async () => {
    if (!imgProductId) return alert("Chọn sản phẩm ở dropdown để quản lý ảnh.");
    if (!imgFiles.length)
      return alert("Hãy chọn ít nhất 1 file ảnh để upload.");

    setLoading(true);
    try {
      let pos = Number(imgStartPos) || 0;

      for (const file of imgFiles) {
        const fd = new FormData();
        fd.append("image", file);

        // Upload file -> nhận relative "/Uploads/xxx"
        const upRes = await axios.post(UPLOAD_URL, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const relativeUrl = upRes?.data?.imageUrl;
        if (relativeUrl) {
          await apiGetTokenClient.post(`${API}/product-image`, {
            product_id: Number(imgProductId),
            imageUrl: relativeUrl,
            alt: imgAlt ?? "",
            position: pos++,
          });
        }
      }

      // reset bộ nhập
      setImgFiles([]);
      setImgAlt("");
      setImgStartPos(pos);

      await loadImages();
    } catch (e) {
      console.error(e);
      setErr(e?.response?.data?.message || "Không thêm được ảnh.");
    } finally {
      setLoading(false);
    }
  };

  // Xoá 1 ảnh khỏi danh sách đang chọn (trước khi upload)
  const removePendingAt = (index) => {
    setImgFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ==== UI ====
  return (
    <div className="admin-ui">
      <div className="ad-pm-container">
        <div className="ad-pm-header">
          <div>
            <div className="ad-pm-title">Quản lý sản phẩm</div>
            <div className="ad-pm-subtle">
              {/* API base: <code>{API}</code> */}
            </div>
          </div>
        </div>

        {err && <div className="alert alert-danger ad-my-3">{err}</div>}
        {loading && <div className="alert alert-info ad-my-3">Đang xử lý…</div>}

        <div className="ad-pm-grid">
          {/* ===== LEFT: Category + Detail ===== */}
          <div className="ad-d-flex ad-flex-column ad-gap-12">
            <div className="card">
              <div className="card-header">Loại sản phẩm</div>
              <div className="card-body">
                <div className="ad-d-flex ad-gap-2 ad-mb-3">
                  <input
                    className="form-control"
                    placeholder="Tên category…"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                  />
                  <button className="btn btn-primary" onClick={addCategory}>
                    + Thêm
                  </button>
                </div>
                <div className="ad-d-flex ad-flex-wrap ad-gap-2">
                  {categories.map((c) => (
                    <div
                      key={c.id}
                      className={`badge ${
                        selectedCat === c.id ? "bg-primary" : ""
                      }`}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setSelectedCat(c.id);
                        setSelectedDetail("");
                        setSelectedProduct("");
                        setImgProductId(null);
                      }}
                    >
                      {c.name}
                      <button
                        className="btn btn-sm btn-link text-danger ms-2 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCategory(c.id);
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {categories.length === 0 && (
                    <span className="ad-text-muted">
                      Chưa có Loại sản phẩm.
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">Chi tiết loại sản phẩm</div>
              <div className="card-body">
                <div className="ad-d-flex ad-gap-2 ad-mb-3">
                  <input
                    className="form-control"
                    placeholder="Tên detail…"
                    value={detailName}
                    onChange={(e) => setDetailName(e.target.value)}
                    disabled={!selectedCat}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={addDetail}
                    disabled={!selectedCat}
                  >
                    + Thêm
                  </button>
                </div>
                <div className="ad-d-flex ad-flex-wrap ad-gap-2">
                  {detailsOfCat.map((d) => (
                    <div
                      key={d.id}
                      className={`badge ${
                        selectedDetail === d.id ? "bg-success" : ""
                      }`}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setSelectedDetail(d.id);
                        setSelectedProduct("");
                        setImgProductId(null);
                      }}
                    >
                      {d.name}
                      <button
                        className="btn btn-sm btn-link text-danger ms-2 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteDetail(d.id);
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {selectedCat && detailsOfCat.length === 0 && (
                    <span className="ad-text-muted">
                      Chưa có chi tiết loại.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ===== RIGHT: Images + Product ===== */}
          <div className="ad-d-flex ad-flex-column ad-gap-12">
            {/* PRODUCT IMAGES (upload only) */}
            <div className="card" ref={imgCardRef}>
              <div className="card-header">Ảnh sản phẩm</div>
              <div className="card-body">
                <div className="row g-2 ad-mb-3">
                  <div className="col-lg-6">
                    <label className="form-label">Chọn sản phẩm</label>
                    <select
                      className="form-select"
                      value={imgProductId ?? ""}
                      onChange={(e) =>
                        setImgProductId(
                          e.target.value ? Number(e.target.value) : null
                        )
                      }
                      disabled={!selectedDetail}
                    >
                      <option value="">— Chọn sản phẩm thuộc chi tiết —</option>
                      {productsOfDetail.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                    <div className="small ad-text-muted ad-mt-1">
                      {imgProductId
                        ? `Đang gắn ảnh cho: ${
                            products.find(
                              (p) => Number(p.id) === Number(imgProductId)
                            )?.name || ""
                          }`
                        : "Chọn sản phẩm ở dropdown để quản lý ảnh."}
                    </div>
                  </div>
                </div>

                <div className="row g-2">
                  <div className="col-12 col-lg-6">
                    <input
                      className="form-control"
                      placeholder="Alt (áp dụng cho tất cả ảnh thêm mới)"
                      value={imgAlt}
                      onChange={(e) => setImgAlt(e.target.value)}
                      disabled={!imgProductId}
                    />
                  </div>
                  <div className="col-6 col-lg-3">
                    <input
                      className="form-control"
                      type="number"
                      placeholder="Vị trí bắt đầu"
                      value={imgStartPos}
                      onChange={(e) => setImgStartPos(e.target.value)}
                      disabled={!imgProductId}
                    />
                  </div>
                  <div className="col-6 col-lg-3">
                    {/* Cộng dồn files qua nhiều lần chọn */}
                    <input
                      className="form-control"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const picked = Array.from(e.target.files || []);
                        if (!picked.length) return;
                        setImgFiles((prev) => {
                          const prevKeys = new Set(
                            prev.map(
                              (f) => `${f.name}_${f.size}_${f.lastModified}`
                            )
                          );
                          const add = picked.filter(
                            (f) =>
                              !prevKeys.has(
                                `${f.name}_${f.size}_${f.lastModified}`
                              )
                          );
                          return [...prev, ...add];
                        });
                        e.target.value = ""; // cho phép chọn lại cùng file ngay
                      }}
                      disabled={!imgProductId}
                    />
                  </div>
                </div>

                {/* === PREVIEW ẢNH ĐANG THÊM (trước khi upload) === */}
                <div className="ad-mt-3">
                  <div className="ad-d-flex ad-gap-2 ad-align-center ad-flex-wrap">
                    <strong>Ảnh đang chọn:</strong>
                    <span className="ad-text-muted">
                      {imgFiles.length
                        ? `${imgFiles.length} ảnh`
                        : "Chưa chọn ảnh."}
                    </span>
                    {!!imgFiles.length && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-xs"
                        onClick={() => setImgFiles([])}
                      >
                        Xoá tất cả
                      </button>
                    )}
                  </div>

                  {!!imgFiles.length && (
                    <div
                      className="ad-mt-2"
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(110px, 1fr))",
                        gap: 12,
                      }}
                    >
                      {imgPreviews.map((src, i) => (
                        <div
                          key={src}
                          className="ad-pm-thumb"
                          title={imgFiles[i]?.name}
                          style={{ position: "relative" }}
                        >
                          <img
                            src={src}
                            alt={`pending-${i}`}
                            style={{
                              width: "100%",
                              aspectRatio: "1 / 1",
                              objectFit: "cover",
                              borderRadius: 10,
                              border: "1px solid #e5e7eb",
                            }}
                            loading="lazy"
                          />
                          <div
                            className="small ad-mt-1 text-truncate"
                            title={imgFiles[i]?.name}
                          >
                            {imgFiles[i]?.name}
                          </div>
                          <button
                            type="button"
                            className="btn btn-danger btn-xs"
                            style={{ width: "100%", marginTop: 6 }}
                            onClick={() => removePendingAt(i)}
                          >
                            Xoá ảnh này
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* === END PREVIEW === */}

                <div className="ad-mt-3">
                  <button
                    className="btn btn-success"
                    onClick={addProductImages}
                    disabled={!imgProductId}
                  >
                    + Thêm ảnh{imgFiles.length ? ` (${imgFiles.length})` : ""}
                  </button>
                </div>

                {/* Danh sách ảnh đã có trên server */}
                <div className="ad-d-flex ad-flex-wrap ad-gap-3 ad-mt-3">
                  {imgProductId && imagesOfSelectedForImage.length === 0 && (
                    <span className="ad-text-muted">Chưa có ảnh.</span>
                  )}
                  {!imgProductId && (
                    <span className="ad-text-muted">
                      Chọn sản phẩm ở dropdown để quản lý ảnh.
                    </span>
                  )}
                  {imagesOfSelectedForImage.map((im) => (
                    <div key={im.id} className="ad-pm-thumb">
                      <img src={toDisplayUrl(im.imageUrl)} alt={im.alt} />
                      <div
                        className="small ad-mt-1 text-truncate"
                        title={im.alt || ""}
                      >
                        {im.alt || (
                          <span className="ad-text-muted">No alt</span>
                        )}
                      </div>
                      <div className="ad-d-flex justify-content-between align-items-center ad-mt-1">
                        <span className="ad-badge text-bg-light">
                          #{im.position ?? 0}
                        </span>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={async () => {
                            if (!window.confirm("Xoá ảnh này?")) return;
                            setLoading(true);
                            try {
                              await apiGetTokenClient.delete(
                                `${API}/product-image`,
                                { data: { id: im.id } }
                              );
                              await loadImages();
                            } catch (e) {
                              console.error(e);
                              setErr(
                                e?.response?.data?.message ||
                                  "Không xoá được ảnh."
                              );
                            } finally {
                              setLoading(false);
                            }
                          }}
                        >
                          Xoá
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* PRODUCT FORM */}
            <div className="card" ref={productFormRef}>
              <div className="card-header">Sản phẩm</div>
              <div className="card-body">
                {/* grid 2 cột: đủ field */}
                <div className="row g-2 ad-mb-3">
                  <div className="col-lg-6">
                    <input
                      className="form-control"
                      placeholder="Tên sản phẩm"
                      value={prodForm.name}
                      onChange={(e) =>
                        setProdForm((p) => ({ ...p, name: e.target.value }))
                      }
                      disabled={!selectedDetail}
                    />
                  </div>
                  <div className="col-lg-3">
                    <input
                      className="form-control"
                      type="number"
                      step="0.01"
                      placeholder="Giá"
                      value={prodForm.price}
                      onChange={(e) =>
                        setProdForm((p) => ({ ...p, price: e.target.value }))
                      }
                      disabled={!selectedDetail}
                    />
                  </div>
                  <div className="col-lg-3">
                    <input
                      className="form-control"
                      placeholder="Đơn vị (vd: hộp, chai...)"
                      value={prodForm.unit}
                      onChange={(e) =>
                        setProdForm((p) => ({ ...p, unit: e.target.value }))
                      }
                      disabled={!selectedDetail}
                    />
                  </div>

                  <div className="col-lg-3">
                    <input
                      className="form-control"
                      placeholder="Số lượng/khối lượng (amount)"
                      value={prodForm.amount}
                      onChange={(e) =>
                        setProdForm((p) => ({ ...p, amount: e.target.value }))
                      }
                      disabled={!selectedDetail}
                    />
                  </div>
                  <div className="col-lg-3">
                    <input
                      className="form-control"
                      placeholder="Quy cách (unit_amount)"
                      value={prodForm.unit_amount}
                      onChange={(e) =>
                        setProdForm((p) => ({
                          ...p,
                          unit_amount: e.target.value,
                        }))
                      }
                      disabled={!selectedDetail}
                    />
                  </div>
                  <div className="col-lg-3">
                    <input
                      className="form-control"
                      placeholder="Ảnh cover (URL)"
                      value={prodForm.image}
                      onChange={(e) =>
                        setProdForm((p) => ({ ...p, image: e.target.value }))
                      }
                      disabled={!selectedDetail}
                    />
                  </div>
                  <div className="col-lg-3">
                    <input
                      className="form-control"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setCoverFile(e.target.files?.[0] || null)
                      }
                      disabled={!selectedDetail}
                    />
                  </div>

                  <div className="col-12">
                    <input
                      className="form-control"
                      placeholder="Nhà sản xuất (manufacturer)"
                      value={prodForm.manufacturer}
                      onChange={(e) =>
                        setProdForm((p) => ({
                          ...p,
                          manufacturer: e.target.value,
                        }))
                      }
                      disabled={!selectedDetail}
                    />
                  </div>

                  <div className="col-12">
                    <textarea
                      className="form-control"
                      rows={2}
                      placeholder="Mô tả ngắn"
                      value={prodForm.description}
                      onChange={(e) =>
                        setProdForm((p) => ({
                          ...p,
                          description: e.target.value,
                        }))
                      }
                      disabled={!selectedDetail}
                    />
                  </div>

                  <div className="col-12">
                    <textarea
                      className="form-control"
                      rows={2}
                      placeholder="Thành phần (ingredient)"
                      value={prodForm.ingredient}
                      onChange={(e) =>
                        setProdForm((p) => ({
                          ...p,
                          ingredient: e.target.value,
                        }))
                      }
                      disabled={!selectedDetail}
                    />
                  </div>

                  <div className="col-12">
                    <textarea
                      className="form-control"
                      rows={2}
                      placeholder="Công dụng (uses)"
                      value={prodForm.uses}
                      onChange={(e) =>
                        setProdForm((p) => ({ ...p, uses: e.target.value }))
                      }
                      disabled={!selectedDetail}
                    />
                  </div>

                  <div className="col-12">
                    <textarea
                      className="form-control"
                      rows={2}
                      placeholder="Hướng dẫn sử dụng (tutorial)"
                      value={prodForm.tutorial}
                      onChange={(e) =>
                        setProdForm((p) => ({ ...p, tutorial: e.target.value }))
                      }
                      disabled={!selectedDetail}
                    />
                  </div>

                  <div className="col-12">
                    <textarea
                      className="form-control"
                      rows={2}
                      placeholder="Lưu ý (note)"
                      value={prodForm.note}
                      onChange={(e) =>
                        setProdForm((p) => ({ ...p, note: e.target.value }))
                      }
                      disabled={!selectedDetail}
                    />
                  </div>

                  <div className="col-12">
                    <textarea
                      className="form-control"
                      rows={2}
                      placeholder="Bảo quản (preserve)"
                      value={prodForm.preserve}
                      onChange={(e) =>
                        setProdForm((p) => ({ ...p, preserve: e.target.value }))
                      }
                      disabled={!selectedDetail}
                    />
                  </div>

                  <div className="col-12">
                    <input
                      className="form-control"
                      placeholder="Liên kết (link) - nếu có trang chi tiết/đặt mua"
                      value={prodForm.link}
                      onChange={(e) =>
                        setProdForm((p) => ({ ...p, link: e.target.value }))
                      }
                      disabled={!selectedDetail}
                    />
                  </div>
                </div>

                {!editingId ? (
                  <button
                    className="btn btn-primary"
                    onClick={addOrUpdateProduct}
                    disabled={!selectedDetail}
                  >
                    + Thêm sản phẩm
                  </button>
                ) : (
                  <div className="ad-d-flex ad-gap-2">
                    <button
                      className="btn btn-warning"
                      onClick={addOrUpdateProduct}
                      disabled={!selectedDetail}
                    >
                      Lưu thay đổi
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={resetProductForm}
                    >
                      Huỷ
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* PRODUCT LIST */}
            <div className="card">
              <div className="card-header d-flex align-items-center justify-content-between">
                <div>
                  Danh sách sản phẩm (thuộc chi tiết:{" "}
                  <strong>
                    {details.find((d) => d.id === selectedDetail)?.name || 0}
                  </strong>
                  )
                </div>
                <button
                  className="btn btn-primary btn-xs"
                  onClick={() => setCollapsed((s) => !s)}
                >
                  {collapsed ? "Mở rộng" : "Thu gọn"}
                </button>
              </div>
              {!collapsed && (
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-sm align-middle">
                      <thead>
                        <tr>
                          <th width="40">#</th>
                          <th>Ảnh</th>
                          <th>Tên</th>
                          <th>Giá</th>
                          <th></th>
                          <th className="col-unit">Đơn vị</th>
                          <th></th>
                          <th className="col-qty">Số lượng (viên)</th>
                          <th className="text-end col-actions">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productsOfDetail.map((p, idx) => (
                          <tr key={p.id}>
                            <td>{idx + 1}</td>
                            <td>
                              {p.image ? (
                                <img
                                  src={toDisplayUrl(p.image)}
                                  alt=""
                                  style={{
                                    width: 56,
                                    height: 56,
                                    objectFit: "cover",
                                    borderRadius: 10,
                                  }}
                                />
                              ) : (
                                <span className="ad-text-muted">—</span>
                              )}
                            </td>
                            <td className="text-truncate" title={p.name}>
                              {p.name}
                            </td>
                            <td>
                              {Number(p.price || 0).toLocaleString("vi-VN")}
                            </td>

                            <td> &nbsp; &nbsp;</td>
                            <td className="col-unit">{p.unit || "-"}</td>
                            <td> &nbsp; &nbsp;</td>
                            <td className="col-qty">{p.amount || "-"}</td>
                            <td className="text-end col-actions">
                              <div className="ad-pm-actions">
                                <button
                                  className="btn btn-primary btn-xs"
                                  onClick={() => {
                                    setSelectedProduct(p.id);
                                    setImgProductId(Number(p.id));
                                    setTimeout(() => {
                                      imgCardRef.current?.scrollIntoView({
                                        behavior: "smooth",
                                        block: "start",
                                      });
                                    }, 0);
                                  }}
                                  title="Quản lý ảnh"
                                >
                                  Ảnh
                                </button>
                                <button
                                  className="btn btn-warning btn-xs"
                                  onClick={() => startEdit(p)}
                                  title="Sửa sản phẩm"
                                >
                                  Sửa
                                </button>
                                <button
                                  className="btn btn-danger btn-xs"
                                  onClick={() => deleteProduct(p.id)}
                                  title="Xoá sản phẩm"
                                >
                                  Xoá
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {selectedDetail && productsOfDetail.length === 0 && (
                          <tr>
                            <td colSpan="9" className="ad-text-muted">
                              Chưa có sản phẩm.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* ===== END RIGHT ===== */}
        </div>
      </div>
    </div>
  );
}
