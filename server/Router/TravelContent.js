module.exports = function (app) {
  var TravelContentController = require("../Controller/TravelContentController");
  app.get("/travel-content", TravelContentController.getList);
  app.put("/travel-content", TravelContentController.update);
  app.post("/travel-content", TravelContentController.addNew);
  app.delete("/travel-content", TravelContentController.delete);
};
