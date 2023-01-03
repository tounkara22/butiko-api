const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const clientSchema = new Schema({
  displayName: {
    type: String,
    required: true,
  },
  clientOf: {
    type: String,
    required: false,
  },
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  lastUpdate: {
    type: String,
    required: false,
  },
  outstandingBalance: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Client", clientSchema);
