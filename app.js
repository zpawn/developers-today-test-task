require("dotenv").config();
const path = require("node:path");
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const { doubleCsrf } = require("csrf-csrf");
const MongoDBSessionStore = require("connect-mongodb-session")(session);
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const helmet = require("helmet");
const compression = require("compression");
const { authRoutes, dashboardRoutes } = require("./routes");
const errorController = require("./controllers/error.controller");
const { mongoConnect }  = require("./utils/db");
const { ROOT_DIR, MONGODB_URI, http } = require("./constants");
const { User } = require("./models");

const app = express();
const store = new MongoDBSessionStore({
  uri: MONGODB_URI,
  databaseName: process.env.DB_NAME,
  collection: "sessions",
});

// configure template engine
app.set("view engine", "pug");
app.set("views", "views");

app.use(helmet());
app.use(compression());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: "my secret",
  resave: false,
  saveUninitialized: false,
  store,
}));
const { doubleCsrfProtection, generateToken } = doubleCsrf({
  cookieName: "_csrf",
  getSecret: () => "supersecret",
  getTokenFromRequest: req => (req.body._csrf || req.headers["x-csrf-token"]),
});
app.use(doubleCsrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuth = req.session?.isAuth;
  res.locals.csrfToken = generateToken(req, res);
  res.locals.errors = req.flash("errors"),
  next();
});

app.use((req, res, next) => {
  if (!req.session.user?._id) {
    next();
  } else {
    User.findById(req.session.user?._id)
      .then((user) => {
        if (user) req.user = user;
        next();
      })
      .catch(next)
  }
});

// configure static resurses (css, js )
app.use(express.static(path.join(ROOT_DIR, "public")));

// configure routes
app.use(authRoutes);
app.use(dashboardRoutes);
app.use(errorController.get404);
app.get("/500", errorController.get500);

app.use((err, req, res, next) => {
  console.trace("[Global Middleware]", err.stack);
  if (!res.headersSent) {
    res.status(http.SERVER_ERROR).render("500", {
      pageTitle: "Some error occurred!",
      path: "/500",
    });
  }
});

mongoConnect()
  .then(() => app.listen(3000))
  .catch(console.error);







