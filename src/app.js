const path = require("path");
const fs = require("fs");

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const helmet = require("helmet"); // secure headers
const compression = require("compression"); // compress assets
const morgan = require("morgan"); // logging
const { MONGODB_URI } = require("./config/AppConst");

/**
 * Controllers
 */
const AppError = require("./controllers/errorController");

/**
 * Routes
 */
const userRoutes = require("./routes/userRoutes");
const foodRoutes = require("./routes/foodsRoute");
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

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  {
    flags: "a",
  }
);

/**
 * Middlewares
 */
app.use(helmet());
app.use(compression());
app.use(morgan("combined", { stream: accessLogStream }));
app.use(bodyParser.json());
app.use("/user", userRoutes); // --- User Acccess
app.use("/food", foodRoutes); // -- Product Access
app.use("/admin", adminRoutes); // --- Admin Access
app.use("/", (req, res, next) => {
  res
    .status(403)
    .json(
      "Resource Access Only Available through Authenticated Endpoints Only"
    );
});
app.use(AppError.unAuthorised); // -- Error Handler

const PORT = process.env.PORT || 8000;

app.listen(PORT);
