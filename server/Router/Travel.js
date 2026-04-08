module.exports = function (app) {
  var TravelController = require("../Controller/TravelController");
  app.get("/travel", TravelController.getList);
  app.put("/travel", TravelController.update);
  app.post("/travel", TravelController.addNew);
  app.delete("/travel", TravelController.delete);
};
