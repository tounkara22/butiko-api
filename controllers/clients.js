const mongodb = require("mongodb");
const Client = require("../models/client");

// POST/clients/all
exports.fetchAll = (req, res) => {
  const { userid } = req.body;
  Client.find({ clientOf: mongodb.ObjectId(userid) })
    .then((clients) => {
      res.status(201).send(clients);
    })
    .catch((e) => console.log(e));
};

// POST/clients/new
exports.newClient = (req, res) => {
  const {
    displayName,
    firstName,
    lastName,
    userid = "63ac649dbf8cbfc0fb15070c",
  } = req.body;
  const client = new Client({
    displayName,
    clientOf: new mongodb.ObjectId(userid),
    firstName,
    lastName,
    outstandingBalance: "0",
    lastUpdate: Date.now(),
  });
  client
    .save()
    .then((nc) => {
      res.status(201).send(nc);
    })
    .catch((e) => console.log("POST/clients/new -- errored", e));
};
