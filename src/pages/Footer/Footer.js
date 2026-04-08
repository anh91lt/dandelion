import React from "react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="row">
        {/* Column 1 */}
        <div className="column">
          <Link to="/">
            <img
              src="/logo/kimanh.svg"
              alt=""
              className="logo"
              style={{ width: "250px", height: "auto" }}
            />
          </Link>

          <p className="desc">
            Chia sẻ cuộc sống tại Nhật. Hàng hóa, thuốc và thực phẩm chức năng
            chính hãng Nhật Bản.
          </p>

          <div className="socials">
            <Link to="#" target="_blank">
              <img
                src="/images/twitter.svg"
                className="icon"
                alt="Kimanhshop"
              />
            </Link>
            <Link to="#" target="_blank">
              <img
                src="/images/facebook.svg"
                className="icon"
                alt="Kimanhshop"
              />
            </Link>
            <Link to="#" target="_blank">
              <img
                src="/images/linked_in.svg"
                className="icon"
                alt="Kimanhshop"
              />
            </Link>
            <Link to="#" target="_blank">
              <img
                src="/images/instagram.svg"
                className="icon"
                alt="Kimanhshop"
              />
            </Link>
          </div>
        </div>

        {/* Column 2 */}
        <div className="column responsive">
          <h3 className="title">About Us</h3>
          <ul className="list">
            <li>
              <Link to="/about">About Us</Link>
            </li>
          </ul>
        </div>

        {/* Column 3 */}
        <div className="column responsive">
          <h3 className="title">Support</h3>
          <ul className="list">
            <li>
              <Link to="/contact">Liên hệ</Link>
            </li>
            <li>
              <Link to="/policy">Chính sách mua・bán hàng</Link>
            </li>
          </ul>
        </div>

        {/* Column 4 */}
        <div className="column responsive">
          <h3 className="title">Address</h3>
          <ul className="list">
            <li>
              <p>
                <strong>Location: </strong>Daitoro 3-Chome, Nakagawa, Nagoya,
                Japan
              </p>
            </li>
            <li>
              <p>
                <strong>Email:</strong> anhlt@gmail.com
              </p>
            </li>
            <li>
              <p>
                <strong>Phone:</strong> +81 080-6666-6523
              </p>
            </li>
          </ul>
        </div>
      </div>

      <div className="row_tabmobile">
        {/* Column 1 */}
        <div className="column">
          <Link to="/">
            <img src="/logo/kimanh.svg" alt="" className="logo" />
          </Link>

          <p className="desc">
            Chia sẻ cuộc sống tại Nhật. Hàng hóa, thuốc và thực phẩm chức năng
            chính hãng Nhật Bản.
          </p>
        </div>
      </div>

      <div className="copyright">
        <p>&copy;2025 Dandelion. All rights reserved.</p>
      </div>
    </div>
  </footer>
);
export default Footer;
