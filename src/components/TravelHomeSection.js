import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import apiGetTokenClient from "../middleWare/getTokenClient";
import "../Admin/styles/productPage.css";

// API & helpers
const API = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";
const getData = (res) => res?.data?.result ?? res?.data ?? [];
const toDisplayUrl = (url) =>
  !url
    ? "/images/placeholder.png"
    : /^https?:|^data:/.test(url)
    ? url
    : `${API}${url}`;
const shortText = (s, len = 220) => {
  if (!s) return "";
  const t = String(s).replace(/\s+/g, " ").trim();
  return t.length > len ? t.slice(0, len - 1) + "…" : t;
};
const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("vi-VN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

// ✅ slugify giống Product.js
const slugify = (s = "") =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

export default function TravelHomeSection({
  title = "Trải nghiệm du lịch tại Nhật Bản",
  moreHref = "/travels",
  limit = 3,
}) {
  const [travels, setTravels] = useState([]);
  const [contents, setContents] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [rt, rc, ri] = await Promise.all([
          apiGetTokenClient.get(`${API}/travel`),
          apiGetTokenClient.get(`${API}/travel-content`),
          apiGetTokenClient.get(`${API}/travel-image`),
        ]);
        setTravels(getData(rt));
        setContents(getData(rc));
        setImages(getData(ri));
      } catch (e) {
        setErr(e?.response?.data?.message || "Không tải được dữ liệu Travel.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // group by travel_id
  const contentMap = useMemo(() => {
    const m = new Map();
    contents.forEach((c) => {
      const arr = m.get(c.travel_id) || [];
      arr.push(c);
      m.set(c.travel_id, arr);
    });
    // sort by position ASC
    for (const v of m.values()) {
      v.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
    }
    return m;
  }, [contents]);

  const imageMap = useMemo(() => {
    const m = new Map();
    images.forEach((im) => {
      const arr = m.get(im.travel_id) || [];
      arr.push(im);
      m.set(im.travel_id, arr);
    });
    for (const v of m.values()) {
      v.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
    }
    return m;
  }, [images]);

  if (loading)
    return (
      <div className="pf-section travel-section">
        <div className="pf-head">
          <h2>{title}</h2>
          <Link className="pf-more" to={moreHref}>
            Xem thêm →
          </Link>
        </div>
        Đang tải…
      </div>
    );

  if (err)
    return (
      <div className="pf-section travel-section">
        <div className="pf-head">
          <h2>{title}</h2>
          <Link className="pf-more" to={moreHref}>
            Xem thêm →
          </Link>
        </div>
        {err}
      </div>
    );

  if (!travels.length) return null;

  return (
    <div className="pf-section travel-section">
      <div className="pf-head">
        <h2>{title}</h2>
        {/* <Link className="pf-more" to={moreHref}>
          Xem thêm →
        </Link> */}
      </div>

      {travels.slice(0, limit).map((t) => {
        const imgs = (imageMap.get(t.id) || []).slice(0, 3);
        const firstParagraph = shortText(
          (contentMap.get(t.id)?.[0]?.content || "").replace(/\n+/g, " "),
          220
        );

        // ✅ id theo slug để anchor nhảy đúng (#travel-<slug>)
        const anchorId = "travel-" + slugify(t.title || String(t.id || ""));

        return (
          <div id={anchorId} key={t.id} className="travel-post">
            <Link to={`/travel/${t.id}`} className="travel-title">
              {t.title}
            </Link>
            <div className="travel-meta">
              Ngày đăng: {fmtDate(t.created_at)} — Bởi {t.author || "Tác giả"}
            </div>

            <div className="travel-gallery">
              {imgs.length > 0 ? (
                imgs.map((im) => (
                  <img
                    key={im.id}
                    src={toDisplayUrl(im.imageUrl)}
                    alt={im.alt || t.title}
                    loading="lazy"
                  />
                ))
              ) : (
                <div className="travel-gallery__empty">Chưa có ảnh.</div>
              )}
            </div>

            {firstParagraph && (
              <p className="travel-excerpt">{firstParagraph}</p>
            )}

            <Link to={`/travel/${t.id}`} className="btn btn-primary btn-sm">
              Đọc thêm
            </Link>
          </div>
        );
      })}
    </div>
  );
}
