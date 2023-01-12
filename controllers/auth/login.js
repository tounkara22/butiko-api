const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { authErrors } = require("../../constants/errors");
const User = require("../../models/user");

const Login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ "credential.email": email })
    .then((userDoc) => {
      if (!userDoc) {
        const error = new Error();
        error.message = authErrors.EMAIL_NOT_FOUND;
        error.status = 401;
        throw error;
      }

      bcrypt
        .compare(password, userDoc?.credential?.password)
        .then((isMatch) => {
          if (!isMatch) {
            const error = new Error();
            error.message = authErrors.PASSWORD_INCORRECT;
            error.status = 401;
            throw error;
          } else {
            const token = jwt.sign(
              {
                email: userDoc.credential.email,
                userId: userDoc._id.toString(),
              },
              process.env.SECRET_JWT_TOKEN,
              { expiresIn: "3h" }
            );
            res.status(201).json({
              token,
              userId: userDoc._id.toString(),
              firstName: userDoc.profile.firstName,
              lastName: userDoc.profile.lastName,
              email: userDoc.credential.email,
              businesses: userDoc.businesses || [],
            });
          }
        })
        .catch((e) => next(e));
    })
    .catch((e) => next(e));
};

module.exports = Login;
