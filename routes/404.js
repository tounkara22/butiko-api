const express = require("express");

const router = express.Router((_, res) => {
  res.status(404).send({});
});

module.exports = router;
