const Product = require("../Model/ProductModel");
const model = new Product();

exports.getList = function (req, res) {
  model.getAll(function (err, data) {
    if (err) return res.status(500).json({ error: err });
    res.json(data);
  });
};

exports.addNew = function (req, res) {
  model.create(req.body, function (err, data) {
    if (err) return res.status(500).json({ error: err });
    res.json(data);
  });
};

exports.update = function (req, res) {
  model.update(req.body, function (err, data) {
    if (err) return res.status(500).json({ error: err });
    res.json(data);
  });
};

exports.delete = function (req, res) {
  model.delete(req.body.id, function (err, data) {
    if (err) return res.status(500).json({ error: err });
    res.json(data);
  });
};
