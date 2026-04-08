// src/pages/Life/Life.js
import React, { useEffect, useState } from "react";
import apiGetTokenClient from "../../middleWare/getTokenClient";
import LifeHomeSection from "../../components/LifeHomeSection";

const API = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";
const getData = (res) => res?.data?.result ?? res?.data ?? [];

const slugify = (s = "") =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

export default function Life() {
  const [lifes, setLifes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const r = await apiGetTokenClient.get(`${API}/life`);
        setLifes(getData(r));
      } catch (e) {
        console.error(e);
        setErr(e?.response?.data?.message || "Không tải được danh sách Life.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <div id="header-container"></div>

      <main className="life-main">
        <div className="container">
          {/* Sidebar: mục lục bài Life */}
          <aside className="sidebar">
            {loading && <div className="small text-muted">Đang tải…</div>}
            {err && !loading && <div className="text-danger small">{err}</div>}
            {!loading && !err && (
              <ul className="life-catalog">
                {lifes.map((l) => (
                  <li key={l.id}>
                    <a href={`#life-${slugify(l.title)}`}>{l.title}</a>
                  </li>
                ))}
              </ul>
            )}
          </aside>

          {/* Nội dung chính: danh sách Life với ảnh lớn */}
          <div className="main-content">
            <LifeHomeSection
              title="Chia sẻ kinh nghiệm sống tại Nhật Bản"
              readMoreLink="/life"
              limit={20}
              variant="page" // hiển thị ảnh lớn (PC cao ~480px, tablet ~360px, mobile ~220px)
            />
          </div>
        </div>
      </main>

      <div id="footer-container"></div>
    </>
  );
}
