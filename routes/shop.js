const path = require("path");
const express = require("express");
const router = express.Router();
const rootDirectory = require("../utils/pathHelper");

const adminData = require("./admin");

const products = adminData.products;

router.get("/", (req, res, next) => {
  res.render("shop", {
    pageTitle: "My Shop",
    products,
    path: "/",
  });
});

exports.routes = router;
