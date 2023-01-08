const user = require("../models/user");

// POST/clients/all
exports.fetchUser = (req, res) => {
  const { userid } = req.body;
  user.findOne({ _id: userid }).then((userDoc) => {
    if (!userDoc) {
      const error = new Error();
      throw error;
    }
    res.send(userDoc);
  });
};
