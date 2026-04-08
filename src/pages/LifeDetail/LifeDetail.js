import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import apiGetTokenClient from "../../middleWare/getTokenClient";
import "../../styles/lifeDetail.css";

const API = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";
const getData = (res) => res?.data?.result ?? res?.data ?? [];
const toDisplayUrl = (url) =>
  !url
    ? "/images/placeholder.png"
    : /^https?:|^data:/.test(url)
    ? url
    : `${API}${url}`;
const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("vi-VN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

export default function LifeDetail() {
  const { id } = useParams();
  const lid = String(id || "").trim();

  const [life, setLife] = useState(null);
  const [images, setImages] = useState([]);
  const [contents, setContents] = useState([]);
  const [titles, setTitles] = useState([]); // NEW: life_title
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

        const all = getData(rl);
        const _life = all.find((x) => String(x.id) === lid) || null;
        setLife(_life);

        const ims = getData(ri).filter(
          (im) => String(im.life_id ?? im.lifeId) === lid
        );
        const cons = getData(rc).filter(
          (c) => String(c.life_id ?? c.lifeId) === lid
        );

        ims.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
        cons.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

        setImages(ims);
        setContents(cons);

        // NEW: lấy life_title (tương thích 2 route)
        try {
          const rlt =
            (await apiGetTokenClient
              .get(`${API}/life-title`)
              .catch(() => null)) ||
            (await apiGetTokenClient
              .get(`${API}/life_title`)
              .catch(() => null));
          const allTitles = getData(rlt) || [];
          const tts = allTitles.filter(
            (t) => String(t.life_id ?? t.lifeId) === lid
          );
          tts.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
          setTitles(tts);
        } catch (e2) {
          console.warn("Không lấy được life_title:", e2);
          setTitles([]);
        }
      } catch (e) {
        console.error(e);
        setErr(
          e?.response?.data?.message || "Không tải được dữ liệu bài Life."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [lid]);

  // Ghép theo position: title / image / content (title ưu tiên nếu bằng vị trí)
  const timeline = useMemo(() => {
    const ims = images.map((i) => ({ _type: "img", ...i }));
    const cons = contents.map((c) => ({ _type: "txt", ...c }));
    const tits = titles.map((t) => ({ _type: "ttl", ...t }));

    const all = [...tits, ...ims, ...cons];
    const rank = (t) => (t === "ttl" ? 0 : t === "img" ? 1 : 2);
    all.sort((a, b) => {
      const pa = a.position ?? 0;
      const pb = b.position ?? 0;
      return pa === pb ? rank(a._type) - rank(b._type) : pa - pb;
    });
    return all;
  }, [images, contents, titles]);

  if (loading) return <div className="ld-container">Đang tải bài viết…</div>;
  if (err) return <div className="ld-container text-danger">{err}</div>;
  if (!life)
    return <div className="ld-container">Không tìm thấy bài viết.</div>;

  return (
    <div className="ld-container">
      {/* Breadcrumb */}
      <nav className="ld-breadcrumb">
        <Link to="/life" className="ld-bc-link">
          Cuộc sống
        </Link>
        <span className="ld-bc-sep">/</span>
        <span className="ld-bc-current">{life.title}</span>
      </nav>

      {/* Header */}
      <header className="ld-header card">
        <div className="card-body">
          <h1 className="ld-title">{life.title}</h1>
          <div className="ld-meta">
            {fmtDate(life.created_at)} • Bởi {life.author || "Tác giả"}
          </div>
          {life.tagline && <div className="ld-tagline">{life.tagline}</div>}
        </div>
      </header>

      {/* Body */}
      <article className="ld-article">
        {timeline.length === 0 && (
          <div className="card">
            <div className="card-body">Chưa có nội dung cho bài viết này.</div>
          </div>
        )}

        {timeline.map((item, idx) => {
          if (item._type === "ttl") {
            // KHỐI TIÊU ĐỀ RIÊNG (không dính liền ảnh)
            return (
              <section key={`t-${idx}`} className="ld-block card">
                <div
                  className="card-body"
                  style={{ width: "60%", margin: "0 auto" }}
                >
                  <h3
                    className="ld-block-title text-center"
                    style={{
                      margin: 0,
                      fontWeight: 800,
                      fontSize: "20px",
                      color: "#111827",
                    }}
                  >
                    {item.title}
                  </h3>
                </div>
              </section>
            );
          }

          if (item._type === "txt") {
            return (
              <section key={`c-${idx}`} className="ld-block ld-content card">
                {item.title && <h3 className="ld-block-title">{item.title}</h3>}
                <div className="card-body">
                  <div className="ld-content-body">{item.content || ""}</div>
                </div>
              </section>
            );
          }

          // _type === "img"
          return (
            <figure key={`i-${idx}`} className="ld-block ld-image card">
              <div className="card-body">
                <div className="ld-imgbox">
                  <img
                    className="ld-img"
                    src={toDisplayUrl(item.imageUrl)}
                    alt={item.alt || life.title}
                    loading="lazy"
                  />
                  {(item.caption || item.alt) && (
                    <figcaption className="ld-caption">
                      {item.caption || item.alt}
                    </figcaption>
                  )}
                </div>
              </div>
            </figure>
          );
        })}
      </article>

      {/* Ghi chú/nguồn (tuỳ chọn) */}
      {life.note && (
        <aside className="ld-note">
          <strong>Lưu ý:</strong> {life.note}
        </aside>
      )}
    </div>
  );
}
