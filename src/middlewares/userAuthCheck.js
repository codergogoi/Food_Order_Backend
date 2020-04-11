const jwt = require("jsonwebtoken");
const AppError = require("../controllers/errorController");
const User = require("../models/user");
const { APP_KEY } = require("../config/AppConst");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return AppError.unAuthorised();
  }
  const token = authorization.replace("Bearer ", "");

  jwt.verify(token, APP_KEY, async (err, payload) => {
    if (err) {
      return AppError.onError(res, "Authorization verification failed!");
    }
    const { userId } = payload;
    User.findById(userId)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) =>
        AppError.onError(res, "Authorization token is not valid")
      );
  });
};
