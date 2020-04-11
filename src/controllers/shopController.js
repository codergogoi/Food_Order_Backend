const Product = require("../models/product");
const AppError = require("./errorController");

/**
 * PUBLIC ACCESS
 */

exports.getAvailableFoods = (req, res, next) => {
  Product.find()
    .then((products) => {
      return res.json(products);
    })
    .catch((err) => {
      return AppError.onError(res, "Foods Not available at this moment");
    });
};

/**
 * PRIVATE ACCESS
 */
exports.getWishlist = (req, res, next) => {
  console.log(req);

  res.json("Available User Wish List");
};
