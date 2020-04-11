const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/userAuthCheck");
const AppError = require("../controllers/errorController");
const shopController = require("../controllers/shopController");

/**
 * PRIVATE ROUTES [Authorization required]
 */
router.get("/wishlist", userAuth, shopController.getWishlist);

/**
 * PUBLIC ROUTES
 */
router.get("/", shopController.getAvailableFoods);

router.use(AppError.onInvalidEndpoint);

module.exports = router;
