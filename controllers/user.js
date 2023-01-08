const { UserError } = require("../constants/errors");
const user = require("../models/user");

// POST/clients/all
exports.fetchUser = (req, res) => {
  const { userid } = req.body;
  user.findOne({ _id: userid }).then((userDoc) => {
    if (!userDoc) {
      const error = new Error(UserError.USER_DOES_NOT_EXIST);
      error.status = 404;
      throw error;
    }
    const { credential, profile, businesses } = userDoc;
    const userResponse = {
      userId: userDoc._id,
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: credential.email,
      businesses: businesses,
    };
    res.send(userResponse);
  });
};
