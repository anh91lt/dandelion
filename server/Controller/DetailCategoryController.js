const DetailCategory = require("../Model/DetailCategoryModel");
const model = new DetailCategory();

exports.getList = function (req, res) {
  model.getAll(function (err, data) {
    res.send({ result: data, error: err });
  });
};

exports.addNew = function (req, res) {
  model.create(req.body, function (err, data) {
    res.send({ result: data, error: err });
  });
};

exports.update = function (req, res) {
  console.log(">>>Controll - Detail Category - NEW DATA: ", req.body);
  model.update(req.body, function (err, data) {
    res.send({ result: data, error: err });
  });
};

exports.delete = function (req, res) {
  const id = Number(req.params?.id ?? req.query?.id ?? req.body?.id);
  if (!id) {
    return res.status(400).json({ message: "Thiếu id detail category." });
  }

  model.delete(id, function (err, data) {
    if (err) {
      console.error("Delete detail category error:", err);
      return res.status(500).json({
        message: "Không xoá được Chi tiết loại.",
        error: err?.sqlMessage || err?.message || err,
      });
    }
    return res.json({ result: data, message: "Xoá thành công." });
  });
};
