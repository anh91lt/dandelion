module.exports = function (app) {
  var LifeTitleController = require("../Controller/LifeTitleController");
  app.get("/life-title", LifeTitleController.getList);
  app.put("/life-title", LifeTitleController.update);
  app.post("/life-title", LifeTitleController.addNew);
  app.delete("/life-title", LifeTitleController.delete);
};
