const Product = require("../models/product");
const AppError = require("./errorController");

exports.addProduct = (req, res, next) => {
  const name = req.body.name;
  const description = req.body.description;
  const category = req.body.category;
  const rating = req.body.rating;
  const price = req.body.price;
  const image = req.body.image;

  const product = new Product({
    name: name,
    description: description,
    category: category,
    rating: rating,
    price: price,
    image: image,
  });

  product
    .save()
    .then((products) => {
      return res.json(products);
    })
    .catch((err) => {
      return AppError.onError(res, "Product add error" + err);
    });
};
