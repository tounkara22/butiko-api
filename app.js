// packages
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

// routes
const clientsRoute = require("./routes/clients");
const authRoute = require("./routes/auth");
const notFoundRoute = require("./routes/404");
const userRoute = require("./routes/user");

// middlewares
const setHeaders = require("./middlewares/set-headers");

// constants
const { MONGODB_URI } = require("./constants/vars");
const isAuth = require("./middlewares/is-auth");

// 1. setups
mongoose.set("strictQuery", false);
const app = express();
app.use(bodyParser.json());
app.use(setHeaders);

// 2. protected routes
app.use("/clients", isAuth, clientsRoute);
app.use("/user", userRoute);

// 3. unprotected routes
app.use("/auth", authRoute);

// 4. Error handler
app.use((error, _, res, next) => {
  if (error != null) {
    const message = error?.message || 'GENERIC_ERROR';
    const status = error?.status || 500;
    res.status(status).send({ error: message });
  } else {
    next();
  }
});

// 5. Not found
app.use(notFoundRoute);


// Server
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(8000);
  })
  .catch((e) => console.log("error connecting...", e));
