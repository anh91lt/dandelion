module.exports = function (app) {
  var ProductImageController = require("../Controller/ProductImageController");
  app.get("/product-image", ProductImageController.getList);
  app.put("/product-image", ProductImageController.update);
  app.post("/product-image", ProductImageController.addNew);
  app.delete("/product-image", ProductImageController.delete);
};
