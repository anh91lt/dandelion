module.exports = function (app) {
  var TravelController = require("../Controller/TravelTitleController");
  app.get("/travel-title", TravelController.getList);
  app.put("/travel-title", TravelController.update);
  app.post("/travel-title", TravelController.addNew);
  app.delete("/travel-title", TravelController.delete);
};
