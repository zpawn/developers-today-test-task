const { User } = require("../models");

// async validator
const isEmailExist = (value) => {
  return User.findOne({ email: value }).then((user) => {
    if (user) {
      return Promise.reject("exists already, please pick a different one.");
    }
  });
};

const isPasswordConfirm = (value, { req }) => {
  if (value !== req.body.password) {
    throw new Error("have to match!");
  }

  return true;
}

module.exports = { isEmailExist, isPasswordConfirm };
