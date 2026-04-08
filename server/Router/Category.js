module.exports = function (app) {
  var CategoryController = require("../Controller/CategoryController");
  app.get("/category", CategoryController.getList);
  app.put("/category", CategoryController.update);
  app.post("/category", CategoryController.addNew);
  app.delete("/category", CategoryController.delete);
};
