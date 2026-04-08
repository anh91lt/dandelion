import React from "react";

const styles = {
  page: { padding: "32px 0 56px", background: "#F5F7FB" },
  container: { width: "min(1100px,92%)", margin: "0 auto" },

  section: { marginBottom: 32 },
  sectionTitle: {
    textAlign: "center",
    fontSize: "1.6rem",
    fontWeight: 700,
    margin: "0 0 16px",
    color: "#111827",
  },
  sectionDesc: {
    textAlign: "center",
    fontSize: "1.05rem",
    lineHeight: "1.8rem",
    color: "#4B5563",
    marginBottom: 18,
  },

  grid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "center",
  },
  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    boxShadow: "0 6px 18px rgba(17,24,39,.07)",
    padding: "18px 20px",
    width: "100%",
    maxWidth: 360,
    transition: "transform .15s ease, box-shadow .15s ease",
  },
  cardName: { fontSize: "1.1rem", fontWeight: 700, margin: "0 0 10px" },
  list: { listStyle: "none", margin: 0, padding: 0, lineHeight: "1.9" },
  label: { display: "inline-block", minWidth: 110, color: "#6B7280" },
  link: { color: "#2563eb", textDecoration: "none" },

  formWrap: {
    width: "min(640px,100%)",
    margin: "0 auto",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 22,
    boxShadow: "0 6px 18px rgba(17,24,39,.07)",
  },
  row: { display: "flex", flexDirection: "column", marginBottom: 14 },
  labelForm: { fontWeight: 600, marginBottom: 6 },
  input: {
    border: "1px solid #d1d5db",
    borderRadius: 10,
    padding: "10px 12px",
    fontSize: "1rem",
    outline: "none",
  },
  textarea: {
    border: "1px solid #d1d5db",
    borderRadius: 10,
    padding: "10px 12px",
    fontSize: "1rem",
    outline: "none",
    resize: "vertical",
  },
  btn: {
    width: "100%",
    border: "none",
    borderRadius: 10,
    background:
      "linear-gradient(90deg, rgba(37,99,235,1) 0%, rgba(29,78,216,1) 100%)",
    color: "#fff",
    fontWeight: 700,
    padding: "12px 14px",
    cursor: "pointer",
  },
};

const Contact = () => (
  <>
    <div id="header-container"></div>

    <main className="main" style={styles.page}>
      <div className="container" style={styles.container}>
        {/* Nhật Bản */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Liên hệ ở Nhật Bản</h2>
          <div style={styles.grid}>
            {/* Card 1 */}
            <article style={styles.card}>
              <h3 style={styles.cardName}>Lê Tuấn Anh</h3>
              <ul style={styles.list}>
                <li>
                  <span style={styles.label}>Điện thoại:</span>
                  <a style={styles.link} href="tel:+818066666523">
                    +81 080-6666-6523
                  </a>
                </li>
                <li>
                  <span style={styles.label}>Zalo:</span> +84 0986-521-091
                </li>
                <li>
                  <span style={styles.label}>Facebook:</span>{" "}
                  <em>chưa cập nhật</em>
                </li>
              </ul>
            </article>

            {/* Card 2 */}
            <article style={styles.card}>
              <h3 style={styles.cardName}>Nguyễn Thiên Kim</h3>
              <ul style={styles.list}>
                <li>
                  <span style={styles.label}>Điện thoại:</span>
                  <a style={styles.link} href="tel:+819044842772">
                    +81 090-4484-2772
                  </a>
                </li>
                <li>
                  <span style={styles.label}>Zalo:</span> +84 0973-506-095
                </li>
                <li>
                  <span style={styles.label}>Facebook:</span>{" "}
                  <em>chưa cập nhật</em>
                </li>
              </ul>
            </article>
          </div>
        </section>

        {/* Việt Nam */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Liên hệ ở Việt Nam</h2>
          <div style={styles.grid}>
            <article style={styles.card}>
              <h3 style={styles.cardName}>Nguyễn Thị Hoàng Yến</h3>
              <ul style={styles.list}>
                <li>
                  <span style={styles.label}>Điện thoại:</span>
                  <a style={styles.link} href="tel:+84975544169">
                    +84 0975-544-169
                  </a>
                </li>
                <li>
                  <span style={styles.label}>Zalo:</span> +84 0986-521-091
                </li>
                <li>
                  <span style={styles.label}>Facebook:</span>{" "}
                  <em>chưa cập nhật</em>
                </li>
              </ul>
            </article>
          </div>
        </section>

        {/* Form liên hệ */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Tin nhắn liên hệ</h2>
          <p style={styles.sectionDesc}>
            Cảm ơn bạn đã quan tâm đến chúng tôi. Hãy điền thông tin dưới đây:
          </p>

          <form action="#" method="post" style={styles.formWrap}>
            <div style={styles.row}>
              <label htmlFor="name" style={styles.labelForm}>
                Họ và tên
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Nguyễn Văn A"
                style={styles.input}
              />
            </div>

            <div style={styles.row}>
              <label htmlFor="email" style={styles.labelForm}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                style={styles.input}
              />
            </div>

            <div style={styles.row}>
              <label htmlFor="message" style={styles.labelForm}>
                Nội dung
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                required
                placeholder="Bạn muốn trao đổi điều gì?"
                style={styles.textarea}
              />
            </div>

            <button type="submit" style={styles.btn}>
              Gửi tin nhắn
            </button>
          </form>
        </section>
      </div>
    </main>

    <div id="footer-container"></div>
  </>
);

export default Contact;
