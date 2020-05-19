const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const AppError = require("./errorController");
const { APP_KEY } = require("../config/AppConst");
const { validationResult } = require("express-validator");

const User = require("../models/user");
const Food = require("../models/food");
const Order = require("../models/order");

exports.onSignup = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error("Validation Erro");
    err.statusCode = 422;
    err.data = errors.array();
    next(err);
    return;
  }

  let email = req.body.email;
  let password = req.body.password;
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;

  bcrypt
    .hash(password, 12)
    .then((hashPassword) => {
      const user = new User({
        email: email,
        password: hashPassword,
        firstName: firstName,
        lastName: lastName,
        address: null,
        phone: null,
        lat: null,
        lng: null,
        cart: [],
        order: [],
      });

      return user.save();
    })
    .then((user) => {
      const token = jwt.sign(
        { userId: user._id.toString(), email: user.email },
        APP_KEY,
        { expiresIn: "90d" }
      );

      res.status(200).json(token);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.onForgotPassword = (req, res, next) => {};

exports.onLogin = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error("Validation Erro");
    err.statusCode = 422;
    err.data = errors.array();
    throw err;
  }

  let email = req.body.email;
  let password = req.body.password;
  let loginUser = null;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const err = new Error("User Does not exist with the provided email ID");
        err.statusCode = 401;
        throw err;
      }
      loginUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((result) => {
      if (!result) {
        const err = new Error("Passwod does not match!");
        err.statusCode = 401;
        throw err;
      }

      const token = jwt.sign(
        { userId: loginUser._id.toString(), email: loginUser.email },
        APP_KEY,
        { expiresIn: "90d" }
      );

      res.status(200).json(token);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getCart = (req, res, next) => {
  const userId = req.userId;

  User.findById(userId)
    .populate("cart.food")
    .then((user) => {
      res.status(200).json(user.cart);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.addToCart = (req, res, next) => {
  const userId = req.userId;
  const foodId = req.params.id;

  console.log("Going through");

  let currentUser;
  User.findById(userId)
    .populate("cart.food")
    .then((user) => {
      currentUser = user;
      return Food.findById(foodId);
    })
    .then((food) => {
      return currentUser.addToCart(food);
    })
    .then((result) => {
      res.status(200).json(result.cart);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.editCart = (req, res, next) => {
  const userId = req.userId;
  const foodId = req.params.id;
  const qty = req.params.qty;

  let currentUser;
  User.findById(userId)
    .populate("cart.food")
    .then((user) => {
      currentUser = user;
      return Food.findById(foodId);
    })
    .then((food) => {
      return currentUser.editCart(food, qty);
    })
    .then((result) => {
      res.status(200).json(result.cart);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getOrder = (req, res, next) => {
  const userId = req.userId;

  User.findById(userId)
    .populate("order")
    .then((user) => {
      res.status(200).json(user.order);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getSelectedOrder = (req, res, next) => {
  const orderId = req.params.id;

  Order.findById(orderId)
    .populate("items")
    .then((order) => {
      res.status(200).json(order);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.addOrder = (req, res, next) => {
  const userId = req.userId;
  const orderId = `${Math.floor(Math.random() * 89999 + 1000)}`;
  let currentUser;
  let total = 0;
  User.findById(userId)
    .populate("order")
    .populate("cart.food")
    .then((user) => {
      currentUser = user;
      let orderedItems = [];
      user.cart.map((item) => {
        let qty = item.qty;
        let price = item.food.price;
        total += qty * price;
        orderedItems.push(item.food);
      });

      let order = new Order({
        orderID: orderId,
        items: orderedItems,
        totalAmount: total,
        orderDate: new Date(),
        paidThrough: "",
        paymentResponse: "",
        orderStatus: "waiting",
      });
      return order.save();
    })
    .then((order) => {
      currentUser.order.push(order);
      currentUser.cart = [];
      return currentUser.save();
    })
    .then((result) => res.status(200).json(result.order))
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.viewProfile = (req, res, next) => {
  const userId = req.userId;

  User.findById(userId)
    .select("-password")
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.editAddress = (req, res, next) => {
  const userId = req.userId;
  const address = req.body.address;
  const lat = req.body.lat;
  const lng = req.body.lng;
  const phone = req.body.phone;

  User.findById(userId)
    .select("-password")
    .then((user) => {
      user.address = address;
      user.phone = phone;
      user.lat = lat;
      user.lng = lng;
      return user.save();
    })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
