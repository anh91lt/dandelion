module.exports = function (app) {
  var LifeController = require("../Controller/LifeController");
  app.get("/life", LifeController.getList);
  app.put("/life", LifeController.update);
  app.post("/life", LifeController.addNew);
  app.delete("/life", LifeController.delete);
};
