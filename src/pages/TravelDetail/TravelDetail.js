import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import apiGetTokenClient from "../../middleWare/getTokenClient";
import "../../styles/travelDetail.css";

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

export default function TravelDetail() {
  const { id } = useParams();
  const tid = String(id || "").trim();

  const [travel, setTravel] = useState(null);
  const [images, setImages] = useState([]);
  const [contents, setContents] = useState([]);
  const [titles, setTitles] = useState([]); // NEW: travel_title
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const [rt, ri, rc] = await Promise.all([
          apiGetTokenClient.get(`${API}/travel`),
          apiGetTokenClient.get(`${API}/travel-image`),
          apiGetTokenClient.get(`${API}/travel-content`),
        ]);

        const allTravels = getData(rt);
        const t = allTravels.find((x) => String(x.id) === tid) || null;
        setTravel(t);

        const ims = getData(ri).filter(
          (im) => String(im.travel_id ?? im.travelId) === tid
        );
        const cons = getData(rc).filter(
          (c) => String(c.travel_id ?? c.travelId) === tid
        );
        ims.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
        cons.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
        setImages(ims);
        setContents(cons);

        // Lấy travel_title (hỗ trợ cả 2 route: gạch ngang & gạch dưới)
        try {
          const rtt =
            (await apiGetTokenClient
              .get(`${API}/travel-title`)
              .catch(() => null)) ||
            (await apiGetTokenClient
              .get(`${API}/travel_title`)
              .catch(() => null));
          const allTitles = getData(rtt) || [];
          const tits = allTitles.filter(
            (tt) => String(tt.travel_id ?? tt.travelId) === tid
          );
          tits.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
          setTitles(tits);
        } catch (e2) {
          console.warn("Không lấy được travel_title:", e2);
          setTitles([]);
        }
      } catch (e) {
        console.error(e);
        setErr(
          e?.response?.data?.message || "Không tải được dữ liệu bài Travel."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [tid]);

  // ==== Timeline: gộp 3 loại khối: title / image / content ====
  const timeline = useMemo(() => {
    const ims = images.map((i) => ({ _type: "img", ...i }));
    const cons = contents.map((c) => ({ _type: "txt", ...c }));
    const tits = titles.map((t) => ({ _type: "ttl", ...t }));

    const all = [...tits, ...ims, ...cons];
    const rank = (t) => (t === "ttl" ? 0 : t === "img" ? 1 : 2); // cùng position: title → image → content
    all.sort((a, b) => {
      const pa = a.position ?? 0;
      const pb = b.position ?? 0;
      return pa === pb ? rank(a._type) - rank(b._type) : pa - pb;
    });
    return all;
  }, [images, contents, titles]);

  if (loading) return <div className="td-container">Đang tải bài viết…</div>;
  if (err) return <div className="td-container text-danger">{err}</div>;
  if (!travel)
    return <div className="td-container">Không tìm thấy bài viết.</div>;

  return (
    <div className="td-container">
      {/* Breadcrumb */}
      <nav className="td-breadcrumb">
        <Link to="/travel" className="td-bc-link">
          Du lịch
        </Link>
        <span className="td-bc-sep">/</span>
        <span className="td-bc-current">{travel.title}</span>
      </nav>

      {/* Header */}
      <header className="td-header card">
        <div className="card-body">
          <h1 className="td-title">{travel.title}</h1>
          <div className="td-meta">
            {fmtDate(travel.created_at)} • Bởi {travel.author || "Tác giả"}
          </div>
          {travel.location && (
            <div className="td-location">Địa điểm: {travel.location}</div>
          )}
        </div>
      </header>

      {/* Body */}
      <article className="td-article">
        {timeline.length === 0 && (
          <div className="card">
            <div className="card-body">Chưa có nội dung cho bài viết này.</div>
          </div>
        )}

        {timeline.map((item, idx) => {
          if (item._type === "ttl") {
            // KHỐI TIÊU ĐỀ RIÊNG (không dính liền ảnh)
            return (
              <section key={`t-${idx}`} className="td-block card">
                <div
                  className="card-body"
                  style={{ width: "60%", margin: "0 auto" }}
                >
                  <h3
                    className="td-block-title text-center"
                    style={{
                      margin: "0",
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
              <section key={`c-${idx}`} className="td-block td-content card">
                {item.title && <h3 className="td-block-title">{item.title}</h3>}
                <div className="card-body">
                  <div className="td-content-body">{item.content || ""}</div>
                </div>
              </section>
            );
          }

          // _type === "img"
          return (
            <figure key={`i-${idx}`} className="td-block td-image card">
              <div className="card-body">
                <div className="td-imgbox">
                  <img
                    className="td-img"
                    src={toDisplayUrl(item.imageUrl)}
                    alt={item.alt || travel.title}
                    loading="lazy"
                  />
                  {(item.caption || item.alt) && (
                    <figcaption className="td-caption">
                      {item.caption || item.alt}
                    </figcaption>
                  )}
                </div>
              </div>
            </figure>
          );
        })}
      </article>

      {/* Footer note */}
      {travel.note && (
        <aside className="td-note">
          <strong>Lưu ý:</strong> {travel.note}
        </aside>
      )}
    </div>
  );
}
