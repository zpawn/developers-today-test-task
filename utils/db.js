const mongoose = require("mongoose");
const { MONGODB_URI } = require("../constants");

const mongoConnect = () => {
  return mongoose.connect(`${MONGODB_URI}/?authSource=admin`, { dbName: process.env.DB_NAME });
};

module.exports = { mongoConnect };
