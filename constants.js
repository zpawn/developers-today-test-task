const ROOT_DIR = __dirname;

const { DB_HOST, DB_USER, DB_PASSWORD } = process.env;

const MONGODB_URI = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:27017`;

const SEC = 1000;
const MIN = SEC * 60;
const HOUR = MIN * 60;

const ITEMS_PER_PAGE = 2;

const http = {
  OK: 200,
  NOT_AUTHENTICATED: 401,
  FORBIDDEN: 403, // NOT_AUTHORIZED
  NOT_FOUND: 404,
  VALIDATION_ERROR: 422,
  SERVER_ERROR: 500,
};

module.exports = {
  ROOT_DIR,
  MONGODB_URI,
  SEC,
  MIN,
  HOUR,
  http,
  ITEMS_PER_PAGE,
};
