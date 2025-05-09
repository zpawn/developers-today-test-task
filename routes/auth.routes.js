const express = require("express");
const { check, body } = require("express-validator");
const { isEmailExist, isPasswordConfirm } = require("../utils/validators");
const { getLogin, getSignup, postLogin, postSignup, postLogout } = require("../controllers/auth.controller");

const router = express.Router();

router.get("/login", getLogin);

router.post("/login",
  [body("email", "enter a valid email").isEmail().normalizeEmail()],
  postLogin,
);

router.get("/signup", getSignup);

router.post("/signup",
  [
    check("email").isEmail().withMessage("ivalid value").custom(isEmailExist),
    body(
      "password",
      "should be only numbers and text and at least 5 characters",
    ).isLength({ min: 5 }).isAlphanumeric().trim(),
    body("confirmPassword").trim().custom(isPasswordConfirm),
  ],
  postSignup,
);

router.post("/logout", postLogout);

module.exports = { router };


