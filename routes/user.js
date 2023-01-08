const express = require("express");

const isAuth = require("../middlewares/is-auth");
const userController = require("../controllers/user");
const router = express.Router();

router.post("/", isAuth, userController.fetchUser);

module.exports = router;
