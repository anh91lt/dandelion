module.exports = function (app) {
  var accountController = require("../Controller/AccountController.js");
  app.post("/register", accountController.postRegister);
  app.post("/login", accountController.postLogin);
  app.post("/login/google", accountController.googleLogin);
};
