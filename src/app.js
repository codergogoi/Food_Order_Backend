const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { MONGODB_URI } = require("./config/AppConst");

/**
 * Controllers
 */
const AppError = require("./controllers/errorController");

/**
 * Routes
 */
const userRoutes = require("./routes/userRoutes");
const shopRoutes = require("./routes/shopRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

/**
 * Database Connection
 */
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {})
  .catch((err) => {
    return AppError.onError(res, err);
  });

/**
 * Middlewares
 */
app.use(bodyParser.json());
app.use(userRoutes); // --- User Acccess
app.use("/shop", shopRoutes); // -- Product Access
app.use("/admin", adminRoutes); // --- Admin Access
app.use(AppError.unAuthorised); // -- Error Handler

app.listen(3000);
