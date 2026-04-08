// src/pages/LifePage.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import apiGetTokenClient from "../../../middleWare/getTokenClient";
import "../../styles/admin.css"; // tái dùng style chung + các class ad-*

/** Base API đúng port 3001 */
const API = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";
const UPLOAD_URL =
  process.env.REACT_APP_UPLOAD_URL || `${API}/upload-image/life`;

/** lấy data từ response (hỗ trợ {result:[]} hoặc mảng trực tiếp) */
const getData = (res) => res?.data?.result ?? res?.data ?? [];

/** render ảnh: nếu là relative (/Uploads/...) => ghép host 3001 */
const toDisplayUrl = (url) =>
  !url ? "" : /^https?:|^data:/.test(url) ? url : `${API}${url}`;

/** Endpoints life_title (fallback gạch ngang ↔ gạch dưới) */
const LIFE_TITLE_ENDPOINTS = [`${API}/life-title`, `${API}/life_title`];

// Helpers gọi API life_title với fallback
async function getLifeTitles() {
  let lastErr;
  for (const url of LIFE_TITLE_ENDPOINTS) {
    try {
      return await apiGetTokenClient.get(url);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}
async function postLifeTitle(payload) {
  let lastErr;
  for (const url of LIFE_TITLE_ENDPOINTS) {
    try {
      return await apiGetTokenClient.post(url, payload);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}
async function putLifeTitle(payload) {
  let lastErr;
  for (const url of LIFE_TITLE_ENDPOINTS) {
    try {
      return await apiGetTokenClient.put(url, payload);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}
async function deleteLifeTitle(payload) {
  let lastErr;
  for (const url of LIFE_TITLE_ENDPOINTS) {
    try {
      return await apiGetTokenClient.delete(url, { data: payload });
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

export default function LifePage() {
  // ======= SOURCE DATA =======
  const [lifes, setLifes] = useState([]);
  const [contents, setContents] = useState([]);
  const [images, setImages] = useState([]);
  const [titles, setTitles] = useState([]); // NEW: life_title

  // ======= SELECTED =======
  const [selectedLife, setSelectedLife] = useState("");

  // ======= FORMS: LIFE =======
  const [lifeForm, setLifeForm] = useState({ title: "", author: "" });
  const [editingLifeId, setEditingLifeId] = useState("");

  // ======= FORMS: CONTENT =======
  const [contentForm, setContentForm] = useState({ content: "", position: "" });
  const [editingContentId, setEditingContentId] = useState("");

  // ======= FORMS: TITLES =======  (NEW)
  const [titleForm, setTitleForm] = useState({ title: "", position: "" });
  const [editingTitleId, setEditingTitleId] = useState("");

  // ======= FORMS: IMAGES =======
  const [imgFiles, setImgFiles] = useState([]); // Array<File> (cộng dồn)
  const [imgAlt, setImgAlt] = useState("");
  const [imgStartPos, setImgStartPos] = useState(0);
  const [imgPreviews, setImgPreviews] = useState([]); // object URLs

  // ======= UX =======
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const contentCardRef = useRef(null);
  const imageCardRef = useRef(null);

  // Preview: tạo & cleanup objectURL
  useEffect(() => {
    const urls = imgFiles.map((f) => URL.createObjectURL(f));
    setImgPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [imgFiles]);

  // ======= LOADERS =======
  const loadLifes = async () => {
    const res = await apiGetTokenClient.get(`${API}/life`);
    setLifes(getData(res));
  };
  const loadContents = async () => {
    const res = await apiGetTokenClient.get(`${API}/life-content`);
    setContents(getData(res));
  };
  const loadImages = async () => {
    const res = await apiGetTokenClient.get(`${API}/life-image`);
    setImages(getData(res));
  };
  const loadTitles = async () => {
    const res = await getLifeTitles();
    setTitles(getData(res));
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        await Promise.all([
          loadLifes(),
          loadContents(),
          loadImages(),
          loadTitles(),
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

  // ======= FILTERED =======
  const contentsOfSelected = useMemo(
    () =>
      contents
        .filter((c) => c.life_id === selectedLife)
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0)),
    [contents, selectedLife]
  );

  const imagesOfSelected = useMemo(
    () =>
      images
        .filter((im) => im.life_id === selectedLife)
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0)),
    [images, selectedLife]
  );

  const titlesOfSelected = useMemo(
    () =>
      titles
        .filter((t) => t.life_id === selectedLife)
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0)),
    [titles, selectedLife]
  );

  // ======= LIFE CRUD =======
  const resetLifeForm = () => {
    setEditingLifeId("");
    setLifeForm({ title: "", author: "" });
  };

  const addOrUpdateLife = async () => {
    const title = lifeForm.title.trim();
    const author = (lifeForm.author || "").trim();
    if (!title) return alert("Nhập tiêu đề bài Life.");

    setLoading(true);
    setErr("");
    try {
      if (editingLifeId) {
        await apiGetTokenClient.put(`${API}/life`, {
          id: editingLifeId,
          title,
          author,
        });
      } else {
        await apiGetTokenClient.post(`${API}/life`, { title, author });
      }
      await loadLifes();
      resetLifeForm();
    } catch (e) {
      console.error(e);
      setErr(e?.response?.data?.message || "Không lưu được bài Life.");
    } finally {
      setLoading(false);
    }
  };

  const deleteLife = async (id) => {
    if (
      !window.confirm(
        "Xoá bài Life này? (nội dung, tiêu đề & ảnh sẽ bị xoá theo)"
      )
    )
      return;
    setLoading(true);
    try {
      await apiGetTokenClient.delete(`${API}/life`, { data: { id } });
      if (selectedLife === id) setSelectedLife("");
      await Promise.all([
        loadLifes(),
        loadContents(),
        loadImages(),
        loadTitles(),
      ]);
    } catch (e) {
      console.error(e);
      setErr(e?.response?.data?.message || "Không xoá được bài Life.");
    } finally {
      setLoading(false);
    }
  };

  // ======= CONTENT CRUD =======
  const resetContentForm = () => {
    setEditingContentId("");
    setContentForm({ content: "", position: "" });
  };

  const addOrUpdateContent = async () => {
    if (!selectedLife) return alert("Chọn bài Life trước.");
    const content = (contentForm.content || "").trim();
    if (!content) return alert("Nhập nội dung.");
    const position = Number(contentForm.position ?? 0) || 0;

    setLoading(true);
    setErr("");
    try {
      if (editingContentId) {
        await apiGetTokenClient.put(`${API}/life-content`, {
          id: editingContentId,
          life_id: selectedLife,
          content,
          position,
        });
      } else {
        await apiGetTokenClient.post(`${API}/life-content`, {
          life_id: selectedLife,
          content,
          position,
        });
      }
      await loadContents();
      resetContentForm();
    } catch (e) {
      console.error(e);
      setErr(e?.response?.data?.message || "Không lưu được nội dung.");
    } finally {
      setLoading(false);
    }
  };

  const deleteContent = async (id) => {
    if (!window.confirm("Xoá khối nội dung này?")) return;
    setLoading(true);
    try {
      await apiGetTokenClient.delete(`${API}/life-content`, { data: { id } });
      await loadContents();
    } catch (e) {
      console.error(e);
      setErr(e?.response?.data?.message || "Không xoá được nội dung.");
    } finally {
      setLoading(false);
    }
  };

  // ======= TITLE CRUD (NEW) =======
  const resetTitleForm = () => {
    setEditingTitleId("");
    setTitleForm({ title: "", position: "" });
  };

  const addOrUpdateTitle = async () => {
    if (!selectedLife) return alert("Chọn bài Life trước.");
    const title = (titleForm.title || "").trim();
    if (!title) return alert("Nhập tiêu đề.");
    const position = Number(titleForm.position ?? 0) || 0;

    setLoading(true);
    setErr("");
    try {
      if (editingTitleId) {
        await putLifeTitle({
          id: editingTitleId,
          life_id: selectedLife,
          title,
          position,
        });
      } else {
        await postLifeTitle({
          life_id: selectedLife,
          title,
          position,
        });
      }
      await loadTitles();
      resetTitleForm();
    } catch (e) {
      console.error(e);
      setErr(e?.response?.data?.message || "Không lưu được tiêu đề.");
    } finally {
      setLoading(false);
    }
  };

  const onDeleteTitle = async (id) => {
    if (!window.confirm("Xoá tiêu đề này?")) return;
    setLoading(true);
    try {
      await deleteLifeTitle({ id });
      await loadTitles();
    } catch (e) {
      console.error(e);
      setErr(e?.response?.data?.message || "Không xoá được tiêu đề.");
    } finally {
      setLoading(false);
    }
  };

  // ======= IMAGE CRUD =======
  const addImages = async () => {
    if (!selectedLife) return alert("Chọn bài Life trước.");
    if (!imgFiles?.length) return alert("Chọn ít nhất một file ảnh để upload.");

    setLoading(true);
    setErr("");
    try {
      let pos = Number(imgStartPos) || 0;

      for (const file of imgFiles) {
        const fd = new FormData();
        fd.append("image", file);
        const upRes = await axios.post(UPLOAD_URL, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const relativeUrl = upRes?.data?.imageUrl;
        if (relativeUrl) {
          await apiGetTokenClient.post(`${API}/life-image`, {
            life_id: selectedLife,
            imageUrl: relativeUrl,
            alt: imgAlt ?? "",
            position: pos++,
          });
        }
      }

      await loadImages();
      setImgStartPos(pos); // tiếp tục vị trí sau lần thêm
      setImgFiles([]); // clear pending
    } catch (e) {
      console.error(e);
      setErr(e?.response?.data?.message || "Không thêm được ảnh.");
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (id) => {
    if (!window.confirm("Xoá ảnh này?")) return;
    setLoading(true);
    try {
      await apiGetTokenClient.delete(`${API}/life-image`, { data: { id } });
      await loadImages();
    } catch (e) {
      console.error(e);
      setErr(e?.response?.data?.message || "Không xoá được ảnh.");
    } finally {
      setLoading(false);
    }
  };

  // Xoá 1 ảnh trong preview trước khi upload
  const removePendingAt = (index) => {
    setImgFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ======= UI =======
  return (
    <div className="admin-ui">
      <div className="ad-pm-container">
        <div className="ad-pm-header">
          <div>
            <div className="ad-pm-title">Quản lý Life</div>
            <div className="ad-pm-subtle">
              {/* API base: <code>{API}</code> */}
            </div>
          </div>
        </div>

        {err && <div className="alert alert-danger ad-my-3">{err}</div>}
        {loading && <div className="alert alert-info ad-my-3">Đang xử lý…</div>}

        <div className="ad-pm-grid">
          {/* ===== LEFT: Bài Life (table) ===== */}
          <div className="ad-d-flex ad-flex-column ad-gap-12">
            <div className="card">
              <div className="card-header">Bài Life</div>
              <div className="card-body">
                {/* Form thêm/cập nhật */}
                <div className="row g-2 ad-mb-3">
                  <div className="col-12 col-lg-5">
                    <input
                      className="form-control"
                      placeholder="Tiêu đề bài viết…"
                      value={lifeForm.title}
                      onChange={(e) =>
                        setLifeForm((p) => ({ ...p, title: e.target.value }))
                      }
                    />
                  </div>
                  <div className="col-12 col-lg-3">
                    <input
                      className="form-control"
                      placeholder="Tác giả…"
                      value={lifeForm.author}
                      onChange={(e) =>
                        setLifeForm((p) => ({ ...p, author: e.target.value }))
                      }
                    />
                  </div>
                  <div className="col-12 col-lg-4 ad-d-flex ad-gap-2">
                    <button
                      className="btn btn-primary flex-1"
                      onClick={addOrUpdateLife}
                    >
                      {editingLifeId ? "Cập nhật" : "+ Thêm"}
                    </button>
                    {editingLifeId && (
                      <button className="btn btn-light" onClick={resetLifeForm}>
                        Huỷ
                      </button>
                    )}
                  </div>
                </div>

                {/* Bảng danh sách Life */}
                <div className="table-responsive ad-life-table-wrap">
                  <table className="table table-sm align-middle ad-life-table">
                    <thead>
                      <tr>
                        <th style={{ width: 56 }}>#</th>
                        <th>Tiêu đề</th>
                        <th style={{ width: 240 }}>Tác giả</th>
                        <th style={{ width: 170 }}>Ngày tạo</th>
                        <th className="text-end" style={{ width: 160 }}>
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {lifes.length === 0 && (
                        <tr>
                          <td colSpan="5" className="ad-text-muted">
                            Chưa có bài Life.
                          </td>
                        </tr>
                      )}

                      {lifes.map((l, idx) => {
                        const isActive = selectedLife === l.id;
                        return (
                          <tr
                            key={l.id}
                            className={isActive ? "table-primary" : ""}
                            onClick={() => setSelectedLife(l.id)}
                            style={{ cursor: "pointer" }}
                            title={`Tạo lúc: ${
                              l.created_at
                                ? new Date(l.created_at).toLocaleString("vi-VN")
                                : ""
                            }`}
                          >
                            <td>{idx + 1}</td>
                            <td className="ad-life-title text-break">
                              {l.title}
                            </td>
                            <td className="ad-life-author text-break">
                              {l.author || "—"}
                            </td>
                            <td className="text-nowrap">
                              {l.created_at
                                ? new Date(l.created_at).toLocaleString(
                                    "vi-VN",
                                    {
                                      hour12: false,
                                    }
                                  )
                                : "—"}
                            </td>
                            <td className="text-end">
                              <div className="ad-pm-actions">
                                <button
                                  className="btn btn-warning btn-xs"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingLifeId(l.id);
                                    setLifeForm({
                                      title: l.title || "",
                                      author: l.author || "",
                                    });
                                  }}
                                >
                                  Sửa
                                </button>
                                <button
                                  className="btn btn-danger btn-xs"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteLife(l.id);
                                  }}
                                >
                                  Xoá
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {!selectedLife && (
                  <div className="small ad-text-muted ad-mt-1">
                    Chọn một bài Life trong bảng để quản lý nội dung, tiêu đề &
                    ảnh.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ===== RIGHT: Title / Content / Image ===== */}
          <div className="ad-d-flex ad-flex-column ad-gap-12">
            {/* TITLE CARD (NEW) */}
            <div className="card">
              <div className="card-header">Tiêu đề (life_title)</div>
              <div className="card-body">
                <div className="row g-2 ad-mb-3">
                  <div className="col-12">
                    <input
                      className="form-control"
                      placeholder={
                        selectedLife
                          ? "Nhập tiêu đề hiển thị trong bài…"
                          : "Hãy chọn 1 bài Life trước."
                      }
                      value={titleForm.title}
                      onChange={(e) =>
                        setTitleForm((p) => ({ ...p, title: e.target.value }))
                      }
                      disabled={!selectedLife}
                    />
                  </div>
                  <div className="col-6 col-lg-3">
                    <input
                      className="form-control"
                      type="number"
                      placeholder="Vị trí"
                      value={titleForm.position}
                      onChange={(e) =>
                        setTitleForm((p) => ({
                          ...p,
                          position: e.target.value,
                        }))
                      }
                      disabled={!selectedLife}
                    />
                  </div>
                  <div className="col-6 col-lg-9 ad-d-flex ad-gap-2">
                    <button
                      className="btn btn-primary"
                      onClick={addOrUpdateTitle}
                      disabled={!selectedLife}
                    >
                      {editingTitleId ? "Cập nhật" : "+ Thêm tiêu đề"}
                    </button>
                    {editingTitleId && (
                      <button
                        className="btn btn-light"
                        onClick={resetTitleForm}
                      >
                        Huỷ
                      </button>
                    )}
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-sm align-middle">
                    <thead>
                      <tr>
                        <th style={{ width: 56 }}>#</th>
                        <th style={{ width: 88 }}>Vị trí</th>
                        <th>Tiêu đề</th>
                        <th className="text-end" style={{ width: 160 }}>
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedLife && titlesOfSelected.length === 0 && (
                        <tr>
                          <td colSpan="4" className="ad-text-muted">
                            Chưa có tiêu đề.
                          </td>
                        </tr>
                      )}
                      {!selectedLife && (
                        <tr>
                          <td colSpan="4" className="ad-text-muted">
                            Chọn một bài Life để quản lý tiêu đề.
                          </td>
                        </tr>
                      )}
                      {titlesOfSelected.map((t, idx) => (
                        <tr key={t.id}>
                          <td>{idx + 1}</td>
                          <td>{t.position ?? 0}</td>
                          <td className="text-break">{t.title}</td>
                          <td className="text-end">
                            <div className="ad-pm-actions">
                              <button
                                className="btn btn-warning btn-xs"
                                onClick={() => {
                                  setEditingTitleId(t.id);
                                  setTitleForm({
                                    title: t.title || "",
                                    position: t.position ?? 0,
                                  });
                                }}
                              >
                                Sửa
                              </button>
                              <button
                                className="btn btn-danger btn-xs"
                                onClick={() => onDeleteTitle(t.id)}
                              >
                                Xoá
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {/* END TITLE CARD */}

            {/* CONTENT CARD */}
            <div className="card" ref={contentCardRef}>
              <div className="card-header">Nội dung</div>
              <div className="card-body">
                <div className="row g-2 ad-mb-3">
                  <div className="col-12">
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder={
                        selectedLife
                          ? "Nhập nội dung (markdown/text) cho bài đã chọn…"
                          : "Hãy chọn 1 bài Life trước."
                      }
                      value={contentForm.content}
                      onChange={(e) =>
                        setContentForm((p) => ({
                          ...p,
                          content: e.target.value,
                        }))
                      }
                      disabled={!selectedLife}
                    />
                  </div>
                  <div className="col-6 col-lg-3">
                    <input
                      className="form-control"
                      type="number"
                      placeholder="Vị trí"
                      value={contentForm.position}
                      onChange={(e) =>
                        setContentForm((p) => ({
                          ...p,
                          position: e.target.value,
                        }))
                      }
                      disabled={!selectedLife}
                    />
                  </div>
                  <div className="col-6 col-lg-9 ad-d-flex ad-gap-2">
                    <button
                      className="btn btn-primary"
                      onClick={addOrUpdateContent}
                      disabled={!selectedLife}
                    >
                      {editingContentId ? "Cập nhật" : "+ Thêm khối"}
                    </button>
                    {editingContentId && (
                      <button
                        className="btn btn-light"
                        onClick={resetContentForm}
                      >
                        Huỷ
                      </button>
                    )}
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-sm align-middle">
                    <thead>
                      <tr>
                        <th style={{ width: 56 }}>#</th>
                        <th style={{ width: 88 }}>Vị trí</th>
                        <th>Nội dung</th>
                        <th className="text-end" style={{ width: 160 }}>
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedLife && contentsOfSelected.length === 0 && (
                        <tr>
                          <td colSpan="4" className="ad-text-muted">
                            Chưa có nội dung.
                          </td>
                        </tr>
                      )}
                      {!selectedLife && (
                        <tr>
                          <td colSpan="4" className="ad-text-muted">
                            Chọn một bài Life để quản lý nội dung.
                          </td>
                        </tr>
                      )}
                      {contentsOfSelected.map((c, idx) => (
                        <tr key={c.id}>
                          <td>{idx + 1}</td>
                          <td>{c.position ?? 0}</td>
                          <td className="text-break">
                            {String(c.content || "").length > 300
                              ? `${String(c.content).slice(0, 300)}…`
                              : c.content || "—"}
                          </td>
                          <td className="text-end">
                            <div className="ad-pm-actions">
                              <button
                                className="btn btn-warning btn-xs"
                                onClick={() => {
                                  setEditingContentId(c.id);
                                  setContentForm({
                                    content: c.content || "",
                                    position: c.position ?? 0,
                                  });
                                }}
                              >
                                Sửa
                              </button>
                              <button
                                className="btn btn-danger btn-xs"
                                onClick={() => deleteContent(c.id)}
                              >
                                Xoá
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* IMAGE CARD */}
            <div className="card" ref={imageCardRef}>
              <div className="card-header">Ảnh</div>
              <div className="card-body">
                <div className="row g-2">
                  <div className="col-12 col-lg-6">
                    {/* Cộng dồn files qua nhiều lần chọn + lọc trùng */}
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

                        // cho phép chọn lại cùng file ngay sau đó
                        e.target.value = "";
                      }}
                      disabled={!selectedLife}
                    />
                    <div className="form-text">
                      Có thể chọn nhiều lần, hệ thống sẽ cộng dồn ảnh (lọc
                      trùng).
                    </div>
                  </div>
                  <div className="col-12 col-lg-3">
                    <input
                      className="form-control"
                      placeholder="Alt cho ảnh"
                      value={imgAlt}
                      onChange={(e) => setImgAlt(e.target.value)}
                      disabled={!selectedLife}
                    />
                  </div>
                  <div className="col-12 col-lg-3">
                    <input
                      className="form-control"
                      type="number"
                      placeholder="Vị trí bắt đầu"
                      value={imgStartPos}
                      onChange={(e) => setImgStartPos(e.target.value)}
                      disabled={!selectedLife}
                    />
                  </div>
                </div>

                {/* PREVIEW ảnh đang chọn */}
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
                {/* END PREVIEW */}

                <div className="ad-mt-3">
                  <button
                    className="btn btn-success"
                    onClick={addImages}
                    disabled={!selectedLife}
                  >
                    + Thêm ảnh{imgFiles.length ? ` (${imgFiles.length})` : ""}
                  </button>
                </div>

                {/* Danh sách ảnh đã có */}
                <div className="ad-d-flex ad-flex-wrap ad-gap-12 ad-mt-3">
                  {!selectedLife && (
                    <span className="ad-text-muted">
                      Chọn một bài Life để quản lý ảnh.
                    </span>
                  )}
                  {selectedLife && imagesOfSelected.length === 0 && (
                    <span className="ad-text-muted">Chưa có ảnh.</span>
                  )}
                  {imagesOfSelected.map((im) => (
                    <div key={im.id} className="ad-pm-thumb">
                      <img src={toDisplayUrl(im.imageUrl)} alt={im.alt} />
                      <div
                        className="small ad-mt-1 ad-text-truncate"
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
                          onClick={() => deleteImage(im.id)}
                        >
                          Xoá
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* END IMAGE CARD */}
          </div>
          {/* ===== END RIGHT ===== */}
        </div>
      </div>
    </div>
  );
}
