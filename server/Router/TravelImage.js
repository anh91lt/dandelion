module.exports = function (app) {
  var TravelImageController = require("../Controller/TravelImageController");
  app.get("/travel-image", TravelImageController.getList);
  app.put("/travel-image", TravelImageController.update);
  app.post("/travel-image", TravelImageController.addNew);
  app.delete("/travel-image", TravelImageController.delete);
};
