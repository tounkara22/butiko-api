// packages
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");

// routes
const clientsRoute = require("./routes/clients");
const authRoute = require("./routes/auth");
const notFoundRoute = require("./routes/404");

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

// 3. unprotected routes

app.use("/auth", authRoute);
app.use(notFoundRoute);

// 4. server start
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(8000);
  })
  .catch((e) => console.log("error connecting...", e));
