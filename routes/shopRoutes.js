const path = require("path");
const express = require("express");
const router = express.Router();
const rootDirectory = require("../utils/pathHelper");

// GET /
router.get("/", (req, res, next) => {
  res.sendFile(path.join(rootDirectory, "views", "shop.html"));
});

module.exports = router;
