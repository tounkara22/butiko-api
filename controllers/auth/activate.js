const { authErrors } = require("../../constants/errors");
const User = require("../../models/user");

const Activate = (req, res, next) => {
  const userId = req.body.id;
  const token = req.body.token;
  User.findOne({
    _id: userId,
  })
    .then((user) => {
      if (!user || user.verified) {
        const error = new Error();
        error.message = authErrors.USER_ALREADY_VERIFIED;
        error.status = 401;
        throw error;
      }

      if (user.verifyToken.toString() !== token.toString()) {
        const error = new Error(authErrors.USER_CANNOT_BE_VERIFIED);
        error.status = 401;
        throw error;
      }

      user.verifyToken = null;
      user.verified = true;
      return user.save();
    })
    .then((user) => {
      res.status(201).json({
        userid: user._id.toString(),
      });
    })
    .catch((e) => next(e));
};

module.exports = Activate;
