const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const credentialSchema = new Schema({
  email: {
    type: String,
    required: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  username: {
    type: String,
    index: true,
  },
});

const profileSchema = new Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  middleName: {
    type: String,
  },
  photoUrl: {
    type: String,
  },
  dateOfBirth: {
    type: Date,
  },
});

const businessSchema = new Schema({
  name: String,
});

const userSchema = new Schema(
  {
    verified: {
      required: true,
      type: Boolean,
    },
    verifyToken: String,
    resetToken: String,
    resetTokenExpiration: Date,
    credential: credentialSchema,
    profile: profileSchema,
    businesses: [businessSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
