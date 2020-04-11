const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const AppError = require("./errorController");
const { APP_KEY } = require("../config/AppConst");

exports.onSignup = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then((existingUser) => {
      if (!existingUser) {
        return bcrypt.hash(password, 12).then((hashedPwd) => {
          const user = new User({
            email: email,
            password: hashedPwd,
            cart: { foods: [] },
          });
          return user.save();
        });
      } else {
        AppError.onError(res, "User Already Exist");
      }
    })
    .then((user) => {
      if (user._id) {
        const token = jwt.sign({ userId: user._id }, APP_KEY);
        res.json({ token: token });
      } else {
        AppError.onError(res, "Service Not unavailable! Please try again!");
      }
    })
    .catch((err) => {
      AppError.onError(res, `${err.message}`);
    });
};

exports.onSignin = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  let loginUser;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        AppError.onError(res, "User does not exist with this email id!");
      } else {
        loginUser = user;
        return bcrypt.compare(password, user.password);
      }
    })
    .then((doMatch) => {
      if (doMatch) {
        const token = jwt.sign({ userId: loginUser._id }, APP_KEY);
        res.json({ token: token });
      } else {
        AppError.onError(res, "User ID password does not match");
      }
    })
    .catch((err) => {
      AppError.onError(res, `${err.message}`);
    });
};
