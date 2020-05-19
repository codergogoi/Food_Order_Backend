const express = require("express");
const router = express.Router();
const auth = require("../middlewares/adminAuth");
const AppError = require("../controllers/errorController");
const adminController = require("../controllers/adminController");

/**
 * PRIVATE ROUTES [Authorization required]
 */
router.post("/add-restaurant", adminController.addRestaurant);

router.post("/add-food/:id", adminController.addFood);

router.get("/view-restaurants", adminController.viewAllRestaurant);

router.use(AppError.onInvalidEndpoint);

module.exports = router;
