const Category = require("../Model/CategoryModel");
const model = new Category();

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
  console.log(">>>Controller - Category - NEW DATA: ", req.body);
  model.update(req.body, function (err, data) {
    res.send({ result: data, error: err });
  });
};

exports.delete = function (req, res) {
  const categoryProductID = req.params.categoryProductID;
  model.delete(categoryProductID, function (err, data) {
    res.send({ result: data, error: err });
  });
};
