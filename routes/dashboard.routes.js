const express = require("express");
const { isAuthMiddleware } = require("../middlewares");
const { getIndex, postSaveHolidays } = require("../controllers/dashboard.controller");

const router = express.Router();

router.get("/", isAuthMiddleware, getIndex);
router.post("/save-holidays", isAuthMiddleware, postSaveHolidays);

module.exports = { router };
