module.exports = function (app) {
  var DetailCategoryController = require("../Controller/DetailCategoryController");
  app.get("/detail-category", DetailCategoryController.getList);
  app.put("/detail-category", DetailCategoryController.update);
  app.post("/detail-category", DetailCategoryController.addNew);
  app.delete("/detail-category", DetailCategoryController.delete);
};
