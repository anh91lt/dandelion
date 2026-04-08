module.exports = function (app) {
  var ProductController = require("../Controller/ProductController");
  app.get("/product", ProductController.getList);
  app.put("/product", ProductController.update);
  app.post("/product", ProductController.addNew);
  app.delete("/product", ProductController.delete);
};
