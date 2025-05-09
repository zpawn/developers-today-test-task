const { http } = require("../constants");

const isAuthMiddleware = (req, res, next) => {
  if (!req.session?.isAuth) {
    return res.status(http.NOT_AUTHENTICATED).redirect("/login");
  }

  next();
};

module.exports = { isAuthMiddleware };
