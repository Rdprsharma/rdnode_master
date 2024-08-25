const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");
const upload = require('../config/multer'); 
const { authJwt } = require("../middlewares");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);
  app.post("/api/auth/updatebio", [authJwt.verifyToken],controller.updateBio);
  app.post("/api/auth/uploadvideo",upload.single('video'),controller.uploadVideo);
  app.get("/api/auth/getvideos/:user_id", controller.getvideoDetails);
  app.get("/api/auth/getAllData",[authJwt.verifyToken], controller.getAllData);
};
