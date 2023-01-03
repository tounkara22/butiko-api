const express = require("express");

const isAuth = require("../middlewares/is-auth");
const clientsController = require("../controllers/clients");
const router = express.Router();

router.post("/all", isAuth, clientsController.fetchAll);
router.post("/new", isAuth, clientsController.newClient);

module.exports = router;
