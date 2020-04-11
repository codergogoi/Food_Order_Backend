const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/userAuthCheck");
const AppError = require("../controllers/errorController");
const shopController = require("../controllers/shopController");
const adminController = require("../controllers/adminController");

/**
 * PRIVATE ROUTES [Authorization required]
 */
router.post("/add-product", userAuth, adminController.addProduct);

/**
 * PUBLIC ROUTES
 */
router.get("/", shopController.getAvailableFoods);

router.use(AppError.onInvalidEndpoint);

module.exports = router;
