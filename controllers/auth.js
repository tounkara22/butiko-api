const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const formData = require("form-data");
const Mailgun = require("mailgun.js");
const crypto = require("crypto");
const AuthErrors = require("../constants/errors");

const {
  SECRET_JWT_TOKEN,
  MAILGUN_DOMAIN,
  MAILGUN_API_KEY,
} = require("../constants/vars");
const User = require("../models/user");

const mailgun = new Mailgun(formData);

// helpers
const handleErrors = (e, response) => {
  response.status(e.status || 404).send({
    error: e || { message: "Not found", status: 404 },
  });
};

// Function handlers
const handleLogin = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ "credential.email": email })
    .then((userDoc) => {
      // error: EMAIL_NOT_FOUND
      if (!userDoc) {
        const error = new Error();
        error.message = AuthErrors.EMAIL_NOT_FOUND;
        error.status = 401;
        throw error;
      }

      bcrypt
        .compare(password, userDoc?.credential?.password)
        .then((isMatch) => {
          if (!isMatch) {
            // error: PASSWORD_INCORRECT
            const error = new Error();
            error.message = AuthErrors.PASSWORD_INCORRECT;
            error.status = 401;
            throw error;
          } else {
            const token = jwt.sign(
              {
                email: userDoc.credential.email,
                userId: userDoc._id.toString(),
              },
              SECRET_JWT_TOKEN,
              { expiresIn: "5h" }
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
        .catch((e) => handleErrors(e, res));
    })
    .catch((e) => handleErrors(e, res));
};

const handleSignup = (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const dateOfBirth = req.body.dateOfBirth;
  const email = req.body.email;
  const phoneNumber = req.body.phoneNumber;
  const password = req.body.password;

  let savedUser;

  User.findOne({ "credential.email": email })
    .then((user) => {
      if (user) {
        const error = new Error();
        error.message = AuthErrors.USER_ALREADY_EXIST;
        error.status = 401;
        throw error;
      }
      return bcrypt.hash(password, 12);
    })
    .then((passwordHashed) => {
      const user = new User({
        verified: false,
        credential: {
          email,
          password: passwordHashed,
          phoneNumber,
        },
        profile: {
          firstName,
          lastName,
          dateOfBirth: new Date(dateOfBirth),
        },
        businesses: [],
      });
      return user.save();
    })
    .then((result) => {
      savedUser = result;
      crypto.randomBytes(32, (e, buf) => {
        if (e) throw e;
        const token = buf.toString("hex");
        savedUser.verifyToken = token;
        savedUser
          .save()
          .then((user) => {
            const msg = mailgun.client({
              username: "api",
              key: MAILGUN_API_KEY,
            });
            msg.messages
              .create(MAILGUN_DOMAIN, {
                from: `Butiko App <butiko.app@gmail.com>`,
                to: `${user.credential.email}`,
                subject: "Activate your email to get started with Butiko",
                text: `Activate your Butiko account to start onboarding\n\nTo activate your account, please click on the below link:\n\nFull link: ${`http://localhost:3000/activate/?id=${user._id.toString()}&token=${token}`}`,
              })
              .then((m) => res.send(user))
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log("Error occurred", err));
      });
    })
    .catch((err) => console.log("Error occurred", err));
};

const handleActivate = (req, res) => {
  const userId = req.body.id;
  const token = req.body.token;
  User.findOne({
    _id: userId,
  })
    .then((user) => {
      // user does not exist
      if (!user) {
        const error = new Error();
        error.message = AuthErrors.USER_ALREADY_VERIFIED;
        error.status = 401;
        throw error;
      }

      // user exists, account verified
      if (user && user.verified) {
        const error = new Error();
        error.message = AuthErrors.USER_ALREADY_VERIFIED;
        error.status = 409; // conflict
        throw error;
      }

      // user exists, unverified
      user.verifyToken = null;
      user.verified = true;
      return user.save();
    })
    .then((user) => {
      res.status(201).json({
        userid: user._id.toString(),
      });
    })
    .catch((e) => handleErrors(e, res));
};

const handleIsAuthenticated = (req, res) => {
  console.log("***heheheheh***", req.get("Authorization"));
  res.send({ text: "text" });
  // if (req.userId) {
  //   res.status(201).json({ userId: req.userId });
  // } else {
  //   const error = new Error();
  //   error.message = "NOT_AUTHENTICATED";
  //   error.status = 401;

  //   throw error;
  // }
};

// Exports
exports.postSignup = handleSignup;
exports.postLogin = handleLogin;
exports.postActivate = handleActivate;
exports.isAuthenticated = handleIsAuthenticated;
