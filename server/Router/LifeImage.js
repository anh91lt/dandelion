module.exports = function (app) {
  var LifeImageController = require("../Controller/LifeImageController");
  app.get("/life-image", LifeImageController.getList);
  app.put("/life-image", LifeImageController.update);
  app.post("/life-image", LifeImageController.addNew);
  app.delete("/life-image", LifeImageController.delete);
};
