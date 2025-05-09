const { http } = require("../constants");

const get404 = (req, res, next) => {
  res.status(http.NOT_FOUND).render("404", {
    pageTitle: "Page Not Found",
    path: "/404",
  });
};

const get500 = (req, res, next) => {
  res.status(http.SERVER_ERROR).render("500", {
    pageTitle: "Some error occurred!",
    path: "/500",
  });
};

module.exports = { get404, get500 };
