const AuthErrors = {
  EMAIL_INVALID: "EMAIL_INVALID",
  EMAIL_NOT_FOUND: "EMAIL_NOT_FOUND",
  PASSWORD_INCORRECT: "PASSWORD_INCORRECT",
  PASSWORD_INVALID: "PASSWORD_INVALID",
  NOT_AUTHENTICATED: "NOT_AUTHENTICATED",
  INVALID_TOKEN: "INVALID_TOKEN",
  USER_ALREADY_EXIST: "USER_ALREADY_EXIST",
  USER_ALREADY_VERIFIED: "USER_ALREADY_VERIFIED",
};

exports.UserError = {
  USER_DOES_NOT_EXIST: "USER_DOES_NOT_EXIST",
};

module.exports = AuthErrors;
