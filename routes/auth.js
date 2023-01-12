const express = require("express");

const Activate = require("../controllers/auth/activate");
const Login = require("../controllers/auth/login");
const Signup = require("../controllers/auth/signup");

const router = express.Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/activate", Activate);

module.exports = router;
