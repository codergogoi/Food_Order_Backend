const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// SIGNUP
router.post("/signup", userController.onSignup);

router.post("/signin", userController.onSignin);

module.exports = router;
