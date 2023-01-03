const jwt = require("jsonwebtoken");

module.exports = (req, _, next) => {
  const headers = req.get("Authorization");
  if (!headers) {
    const error = new Error("NOT_AUTHENTICATED");
    error.status = 401;
    throw error;
  }

  const token = headers.split(" ")[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, SECRET_JWT_TOKEN);
  } catch (err) {
    err.status = 500;
    throw err;
  }

  if (!decodedToken) {
    const error = new Error();
    error.message = "NOT_AUTHENTICATED";
    error.status = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};
