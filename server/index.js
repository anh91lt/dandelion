// server/index.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const multer = require("multer");

const app = express();

const PUBLIC_DIR = path.resolve(__dirname, "..", "public");
const UPLOADS_DIR = path.join(PUBLIC_DIR, "Uploads");

// tạo thư mục gốc và các bucket
const BUCKETS = ["product", "life", "travel"];
fs.mkdirSync(UPLOADS_DIR, { recursive: true });
for (const b of BUCKETS)
  fs.mkdirSync(path.join(UPLOADS_DIR, b), { recursive: true });

// factory tạo uploader theo bucket
function makeUploader(bucket) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(UPLOADS_DIR, bucket)),
    filename: (req, file, cb) => {
      const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, `${unique}-${file.originalname}`);
    },
  });
  return multer({
    storage,
    // (khuyến nghị) chặn kích thước & mime
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter(req, file, cb) {
      if (!/^image\/(png|jpe?g|gif|webp)$/i.test(file.mimetype)) {
        return cb(new Error("Chỉ cho phép upload ảnh"));
      }
      cb(null, true);
    },
  });
}

// middleware
app.use(cors());
app.use(bodyParser.json());

// serve tĩnh
app.use(express.static(PUBLIC_DIR)); // /index.html, /logo.png...
app.use("/Uploads", express.static(UPLOADS_DIR)); // /Uploads/**

/* Routers */
require("./Router/Account")(app);
require("./Router/Category")(app);
require("./Router/DetailCategory")(app);

require("./Router/Product")(app);
require("./Router/ProductImage")(app);

require("./Router/Life")(app);
require("./Router/LifeContent")(app);
require("./Router/LifeImage")(app);
require("./Router/LifeTitle")(app);

require("./Router/Travel")(app);
require("./Router/TravelContent")(app);
require("./Router/TravelImage")(app);
require("./Router/TravelTitle")(app);

/* Upload endpoints theo bucket */
// product
app.post(
  "/upload-image/product",
  makeUploader("product").single("image"),
  (req, res) => {
    if (!req.file)
      return res.status(400).json({ error: "Không có file nào được tải lên" });
    const imageUrl = `/Uploads/product/${req.file.filename}`;
    res.json({ message: "OK", imageUrl });
  }
);
// life
app.post(
  "/upload-image/life",
  makeUploader("life").single("image"),
  (req, res) => {
    if (!req.file)
      return res.status(400).json({ error: "Không có file nào được tải lên" });
    const imageUrl = `/Uploads/life/${req.file.filename}`;
    res.json({ message: "OK", imageUrl });
  }
);
// travel
app.post(
  "/upload-image/travel",
  makeUploader("travel").single("image"),
  (req, res) => {
    if (!req.file)
      return res.status(400).json({ error: "Không có file nào được tải lên" });
    const imageUrl = `/Uploads/travel/${req.file.filename}`;
    res.json({ message: "OK", imageUrl });
  }
);

app.listen(3001, () => {
  console.log("Server chạy port 3001");
  console.log("PUBLIC_DIR :", PUBLIC_DIR);
  console.log("UPLOADS_DIR:", UPLOADS_DIR);
});
