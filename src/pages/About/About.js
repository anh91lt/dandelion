import React from "react";

const About = () => (
  <>
    <div id="header-container"></div>
    <main
      className="main"
      style={{ minHeight: 600, background: "#F0F0F0", padding: "20px 0" }}
    >
      <div className="container">
        <div className="about" style={{ color: "#333", padding: 20 }}>
          <h3
            className="title"
            style={{ fontSize: "1.8rem", fontWeight: "bold", marginBottom: 15 }}
          >
            About Us
          </h3>
          <p style={{ fontSize: "1.6rem", lineHeight: 1.6, marginBottom: 10 }}>
            Dandelion Kim Anh.
            <br />
            Gia đình nhỏ của mình hiện đang sinh sống và làm việc tại thành phố
            Nagoya trực thuộc tỉnh Aichi. <br />
            <br />
            Ý tưởng tạo trang web này đã nhen nhóm lên từ lâu với mục đích chính
            của trang là giới thiệu về hình ảnh, giá cả và công dụng của các sản
            phẩm mà mọi người quan tâm như một nơi để tham khảo.
            <br />
            <br />
            Ngoài ra mình cũng có các bài viết chia sẻ nhằm giúp đỡ các bạn mới,
            đã và sẽ sang Nhật Bản sinh sống và học tập có thể làm quen với cuộc
            sống một cách nhanh chóng và hiểu các thủ tục cơ bản một cách đơn
            giản nhất.
            <br />
            <br />
            Hy vọng đây sẽ là một trang web có ích cho mọi người. Hãy cùng nhau
            khám phá và trải nghiệm Nhật Bản thông qua trang web này nhé!
          </p>
          <br />
          <p style={{ fontSize: "1.6rem", lineHeight: 1.6, marginBottom: 10 }}>
            Chi tiết liên hệ xin vui lòng tham khảo phần liên hệ sau:
            <br />
            <a href="./contact.html" style={{ color: "#007BFF" }}>
              Liên hệ với chúng tôi qua Điện thoại, Facebook hoặc Zalo
            </a>
            <br />
            <br />
            Hoặc tham khảo về chính sách mua・bán, chi phí vận chuyển của chúng
            tôi:
            <br />
            <a href="./policy.html" style={{ color: "#007BFF" }}>
              Chính sách mua・bán & Chi phí vận chuyển
            </a>
          </p>
        </div>
      </div>
    </main>
    <div id="footer-container"></div>
  </>
);
export default About;
