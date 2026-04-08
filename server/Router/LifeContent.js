module.exports = function (app) {
  var LifeContentController = require("../Controller/LifeContentController");
  app.get("/life-content", LifeContentController.getList);
  app.put("/life-content", LifeContentController.update);
  app.post("/life-content", LifeContentController.addNew);
  app.delete("/life-content", LifeContentController.delete);
};
