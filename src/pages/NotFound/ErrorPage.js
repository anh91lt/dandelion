import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../styles/notfound.css";

export default function NotFound() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <main className="nf">
      <div className="nf-card">
        <div className="nf-emoji" aria-hidden>
          🧭
        </div>
        <h1 className="nf-code">404</h1>
        <h2 className="nf-title">Không tìm thấy trang</h2>
        <p className="nf-desc">
          Đường dẫn <code className="nf-path">{pathname}</code> không tồn tại
          hoặc đã được di chuyển.
        </p>

        <div className="nf-actions">
          <button className="btn btn-light" onClick={() => navigate(-1)}>
            ← Quay lại
          </button>
          <Link className="btn btn-primary" to="/">
            Về trang chủ
          </Link>
        </div>
      </div>
    </main>
  );
}
