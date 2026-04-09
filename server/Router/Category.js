module.exports = function (app) {
  const CategoryController = require("../Controller/CategoryController");

  app.get("/category", CategoryController.getList);
  app.put("/category", CategoryController.update);
  app.post("/category", CategoryController.addNew);

  // hỗ trợ RESTful: /category/123
  app.delete("/category/:id", CategoryController.delete);

  // giữ tương thích cũ: body/query id
  app.delete("/category", CategoryController.delete);
};
