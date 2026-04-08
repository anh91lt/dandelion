const Policy = () => (
  <>
    <main
      className="main"
      style={{ minHeight: 600, background: "#F0F0F0", padding: "20px 0" }}
    >
      <div className="container">
        <div className="about" style={{ color: "#333", padding: 20 }}>
          <h2
            className="title"
            style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: 15 }}
          >
            Policy
          </h2>
          <br />
          <h3 style={{ fontSize: "1.8rem", fontWeight: 500, marginBottom: 15 }}>
            Về vấn đề mua hàng của Nhật và ship về Hà Nội - Việt Nam
          </h3>
          <p style={{ fontSize: "1.6rem", lineHeight: 1.6, marginBottom: 10 }}>
            Chúng mình nhận mua hộ hàng trên{" "}
            <a target="_blank" href="https://www.amazon.co.jp/">
              Amazon
            </a>
            ,
            <a target="_blank" href="https://www.rakuten.co.jp/">
              Rakuten
            </a>
            ,
            <a target="_blank" href="https://jp.mercari.com/">
              Mercari(NEW/2ND)
            </a>
            ,
            <a target="_blank" href="https://jmty.jp/">
              Jimoty(2ND)
            </a>{" "}
            hay các trang thương mại khác như
            <a target="_blank" href="https://www2.hm.com/ja_jp/index.html">
              HM
            </a>
            ,
            <a target="_blank" href="https://zozo.jp/">
              ZOZOTOWN
            </a>
            ,
            <a target="_blank" href="https://thebase.com/">
              BASE
            </a>
            ,
            <a target="_blank" href="https://jp.shein.com//">
              SHEIN
            </a>
            ,...
            <br />
            và sau đó ship về <strong>Hà Nội - Việt Nam</strong> với chi phí
            chung như sau:
          </p>
          <br />
          <br />
          <h3 style={{ fontSize: "1.8rem", fontWeight: 500, marginBottom: 15 }}>
            Về tỉ giá
          </h3>
          <p style={{ fontSize: "1.6rem", lineHeight: 1.6, marginBottom: 10 }}>
            Tỉ giá sẽ lấy theo giá thị trường cập nhật hàng ngày + ~5JPY
            <br />
            Ví dụ: Tỉ giá JPY → VNĐ ngày 2023/08/10 là 165.28, thì giá tính toán
            sẽ là 170JPY (chi phí này thực chất là chi phí đổi tiền từ VNĐ sang
            → JPY để phục vụ mua hàng ở Nhật Bản)
          </p>
          <br />
          <br />
          <h3 style={{ fontSize: "1.8rem", fontWeight: 500, marginBottom: 15 }}>
            Về chi phí vận chuyển
          </h3>
          <p style={{ fontSize: "1.6rem", lineHeight: 1.6, marginBottom: 10 }}>
            Chi phí vận chuyển từ Nagoya → Hà Nội: 1kg = 200,000 VNĐ. Đây là chi
            phí cố định và do bên cung cấp dịch vụ vận chuyển thông báo với
            mình.
          </p>
        </div>
      </div>
    </main>
  </>
);
export default Policy;
