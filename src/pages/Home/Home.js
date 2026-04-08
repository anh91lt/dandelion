import ProductFavorite from "../../components/product_favorite";
import TravelHomeSection from "../../components/TravelHomeSection";
import LifeHomeSection from "../../components/LifeHomeSection";

const Home = () => (
  <>
    <main className="main">
      <div className="container">
        {/* Giới thiệu chung */}
        <section className="main-gioithieuchung">
          <h2>Giới thiệu trang</h2>
          <p>
            Dandelion Kim Anh Shop.
            <br />
            <br />
            Mục đích chính của trang là giới thiệu về hình ảnh, giá cả và công
            dụng của các sản phẩm mà mọi người quan tâm như một địa chỉ tham
            khảo đáng tin cậy đối với các sản phẩm chính hãng Nhật Bản.
            <br />
            <br />
            Ngoài ra mình cũng có các bài viết nhằm chia sẻ các địa điểm du lịch
            đã trải nhiệm, các bài viết chia sẻ kinh nghiệm sinh sống, sinh hoạt
            tại Nagoya-Aichi, nhằm giúp mọi người những ai đã và sẽ sang Nhật
            Bản sinh sống và học tập có thể làm quen với cuộc sống một cách
            nhanh chóng và hiểu các thủ tục cơ bản một cách đơn giản nhất.
            <br />
            <br />
            Bắt đầu thôi. Hãy cùng nhau khám phá và trải nghiệm Nhật Bản thông
            qua trang web này nhé!
          </p>
        </section>
        {/* Sản phẩm */}
        <section className="main-sanpham">
          <div className="section-header">
            <h2>
              <a href="/products">Sản phẩm Nhật được ưa thích</a>
            </h2>
            <p className="read-more">
              <a href="/products">Đọc thêm →</a>
            </p>
          </div>
          <ProductFavorite limit={8} descLen={60} />
        </section>
        {/* Du lịch ở Nhật Bản */}
        <section className="main-dulichonhat">
          <div className="section-header">
            <h2>
              <a href="/travel">Trải nghiệm du lịch tại Nhật Bản</a>
            </h2>
            <p className="read-more">
              <a href="/travel">Đọc thêm →</a>
            </p>
          </div>
          <TravelHomeSection limit={3} />
        </section>
        {/* Cuộc sống ở Nhật Bản */}
        <section className="main-cuocsongonhat">
          <div className="section-header">
            <h2>
              <a href="/life">Chia sẻ kinh nghiệm sống tại Nhật Bản</a>
            </h2>
            <p className="read-more">
              <a href="/life">Đọc thêm →</a>
            </p>
          </div>
          <LifeHomeSection
            title="Chia sẻ kinh nghiệm sống tại Nhật Bản"
            readMoreLink="/life"
            limit={4}
            variant="home"
          />
        </section>
      </div>
    </main>
  </>
);
export default Home;
