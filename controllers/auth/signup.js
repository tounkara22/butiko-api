const formData = require("form-data");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Mailgun = require("mailgun.js");

const User = require("../../models/user");
const { authErrors } = require("../../constants/errors");

const mailgun = new Mailgun(formData);

const sendMessage = (user, res, next) => {
  const from = "Butiko App <butiko.app@gmail.com>";
  const subject = "Verify your email and get started with Butiko";
  const to = user.credential.email;
  const token = user.verifyToken;
  const msgHTML = `
      <h4>Hi ${user.profile.firstName}</h4>
      </br>
      <p>Just one more step before we let you get started with Butiko</p>
      </br>
      <p>To activate your account, please click on the below link</p>
      <a href="${`http://localhost:3000/activate/?id=${user._id.toString()}&token=${token}`}">Email verification link</a>
      </br>
      <p>Full link: ${`http://localhost:3000/activate/?id=${user._id.toString()}&token=${token}`}</p>
      </br></br>
      <p>Sincerely,</p>
      <strong>Butiko Team</strong>`;

  const msg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY,
  });

  msg.messages
    .create(process.env.MAILGUN_DOMAIN, { from, to, subject, html: msgHTML })
    .then(() => res.status(201).json(user))
    .catch(() => {
      const error = new Error(authErrors.EMAIL_NOT_VERIFIED);
      error.status = 202;
      return next(error);
    });
};

const Signup = (req, res, next) => {
  const { firstName, lastName, dateOfBirth, email, phoneNumber, password } = req.body;

  let savedUser;

  User.findOne({ "credential.email": email })
    .then((user) => {
      if (user) {
        const error = new Error(authErrors.USER_ALREADY_EXIST);
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
        if (e) {
          const error = new Error(authErrors.EMAIL_NOT_VERIFIED);
          error.status = 202;
          throw error;
        }
        const token = buf.toString("hex");
        savedUser.verifyToken = token;
        savedUser
          .save()
          .then((user) => sendMessage(user, res, next))
          .catch((e) => {
            const error = new Error(authErrors.EMAIL_NOT_VERIFIED);
            error.status = 202;
            return next(error);
          });
      });
    })
    .catch((e) => next(e));
};

module.exports = Signup;
