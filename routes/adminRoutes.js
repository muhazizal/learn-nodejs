const path = require("path");
const express = require("express");
const router = express.Router();
const rootDirectory = require("../utils/pathHelper");

// GET /admin/add-product
router.get("/add-product", (req, res, next) => {
  res.sendFile(path.join(rootDirectory, "views", "add-product.html"));
});

// POST /admin/product
router.post("/product", (req, res, next) => {
  const { title } = req.body;
  console.log(title);

  res.redirect("/");
});

module.exports = router;
