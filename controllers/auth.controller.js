const { validationResult } = require("express-validator");
const { User } = require("../models");
const { http } = require("../constants");

const getLogin = async (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
  });
};

const postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(http.VALIDATION_ERROR).render("auth/login", {
      pageTitle: "Login",
      path: "/login",
      values: { email, password },
      validations: errors.array(),
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    req.flash("errors", "Invalid email or password.");
    return res.status(http.VALIDATION_ERROR).render("auth/login", {
      pageTitle: "Login",
      path: "/login",
      values: { email, password },
    });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(http.VALIDATION_ERROR).render("auth/login", {
      pageTitle: "Login",
      path: "/login",
      values: { email, password },
      errors: ["Invalid email or password."],
    });
  }

  req.session.user = user;
  req.session.isAuth = true;

  req.session.save((err) => {
    err ? next(err) : res.redirect("/");
  });
};

const getSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Signup",
    path: "/signup",
  });
};

const postSignup = async (req, res, next) => {
  try {
    const { email, password, confirmPassword } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(http.VALIDATION_ERROR).render("auth/signup", {
        pageTitle: "Signup",
        path: "/signup",
        validations: errors.array(),
        values: { email, password, confirmPassword },
      });
    }

    const user = new User({ email, password });
    await user.save();

    return res.redirect("/login");
  } catch (err) {
    req.flash("errors", err.message);
    res.redirect("/signup")
  }
};

const postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    err ? next(err) : res.redirect("/");
  });
};

module.exports = { getLogin, postLogin, getSignup, postSignup, postLogout };
