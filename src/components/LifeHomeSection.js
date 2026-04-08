// src/components/LifeHomeSection.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import apiGetTokenClient from "../middleWare/getTokenClient";

const API = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";
const getData = (res) => res?.data?.result ?? res?.data ?? [];
const toDisplayUrl = (url) =>
  !url
    ? "/images/placeholder.png"
    : /^https?:|^data:/.test(url)
    ? url
    : `${API}${url}`;
const shortText = (s, len = 200) => {
  if (!s) return "";
  const t = String(s).replace(/\s+/g, " ").trim();
  return t.length > len ? t.slice(0, len - 1) + "…" : t;
};

// slugify đồng bộ
const slugify = (s = "") =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

export default function LifeHomeSection({
  title = "Chia sẻ kinh nghiệm sống tại Nhật Bản",
  readMoreLink = "/life",
  limit = 6,
  className = "",
  // home = thẻ nhỏ (homepage), page = thẻ lớn (Life page)
  variant = "home",
}) {
  const [lifes, setLifes] = useState([]);
  const [images, setImages] = useState([]);
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const [rl, ri, rc] = await Promise.all([
          apiGetTokenClient.get(`${API}/life`),
          apiGetTokenClient.get(`${API}/life-image`),
          apiGetTokenClient.get(`${API}/life-content`),
        ]);
        setLifes(getData(rl));
        setImages(getData(ri));
        setContents(getData(rc));
      } catch (e) {
        setErr(e?.response?.data?.message || "Không tải được bài Life.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const posts = useMemo(() => {
    const byLifeIdImgs = new Map();
    images.forEach((im) => {
      const arr = byLifeIdImgs.get(im.life_id) || [];
      arr.push(im);
      byLifeIdImgs.set(im.life_id, arr);
    });

    const byLifeIdContents = new Map();
    contents.forEach((c) => {
      const arr = byLifeIdContents.get(c.life_id) || [];
      arr.push(c);
      byLifeIdContents.set(c.life_id, arr);
    });

    const merged = lifes
      .map((l) => {
        const imgs = (byLifeIdImgs.get(l.id) || []).sort(
          (a, b) => (a.position ?? 0) - (b.position ?? 0)
        );
        const cons = (byLifeIdContents.get(l.id) || []).sort(
          (a, b) => (a.position ?? 0) - (b.position ?? 0)
        );
        return {
          ...l,
          thumb: imgs[0]?.imageUrl || "",
          excerpt: cons[0]?.content || "",
        };
      })
      .sort(
        (a, b) =>
          new Date(b.created_at || 0).getTime() -
          new Date(a.created_at || 0).getTime()
      );

    return merged.slice(0, limit);
  }, [lifes, images, contents, limit]);

  return (
    <section className={`life-section pf-section ${className}`}>
      <div className="pf-head">
        <h2 className="title">{title}</h2>
        {/* <Link to={readMoreLink} className="pf-more">Đọc thêm →</Link> */}
      </div>

      {loading && <div className="text-muted">Đang tải…</div>}
      {err && <div className="text-danger">{err}</div>}

      {!loading && !err && (
        <>
          {variant === "home" ? (
            // HOME VARIANT — thumbnail nhỏ + nút dưới ảnh
            <div className="life-list">
              {posts.map((p) => {
                const id = `life-${slugify(p.title || String(p.id || ""))}`;
                return (
                  <article
                    id={id}
                    key={p.id}
                    className="life-card life-card--row"
                  >
                    <div className="life-left">
                      <Link to={`/life/${p.id}`} className="life-thumb">
                        <img
                          className="life-img life-img--sm"
                          src={toDisplayUrl(p.thumb)}
                          alt={p.title || "Life post"}
                          loading="lazy"
                        />
                      </Link>
                      <Link
                        to={`/life/${p.id}`}
                        className="btn btn-primary btn-sm life-more-under"
                      >
                        Đọc thêm
                      </Link>
                    </div>

                    <div className="life-body">
                      <Link to={`/life/${p.id}`} className="life-title">
                        {p.title}
                      </Link>
                      <div className="life-meta">
                        {p.created_at
                          ? new Date(p.created_at).toLocaleDateString("vi-VN")
                          : ""}{" "}
                        • Bởi {p.author || "Tác giả"}
                      </div>
                      <div className="life-excerpt">
                        {shortText(p.excerpt, 280)}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            // PAGE VARIANT — ảnh lớn, đầy đủ
            <div className="life-list">
              {posts.map((p) => {
                const id = `life-${slugify(p.title || String(p.id || ""))}`;
                return (
                  <article
                    id={id}
                    key={p.id}
                    className="life-card life-card--page"
                  >
                    <Link
                      to={`/life/${p.id}`}
                      className="life-title life-title--lg"
                    >
                      {p.title}
                    </Link>
                    <div className="life-meta">
                      {p.created_at
                        ? new Date(p.created_at).toLocaleDateString("vi-VN")
                        : ""}{" "}
                      • Bởi {p.author || "Tác giả"}
                    </div>

                    <Link to={`/life/${p.id}`} className="life-thumb mt-8">
                      <img
                        className="life-img life-img--lg"
                        src={toDisplayUrl(p.thumb)}
                        alt={p.title || "Life post"}
                        loading="lazy"
                      />
                    </Link>

                    <div className="life-excerpt mt-8">
                      {shortText(p.excerpt, 900)}
                    </div>

                    <Link to={`/life/${p.id}`} className="btn btn-primary mt-8">
                      Đọc thêm
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}
    </section>
  );
}
