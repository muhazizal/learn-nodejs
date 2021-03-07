const path = require("path");
const express = require("express");
const router = express.Router();
const rootDirectory = require("../utils/pathHelper");

const products = [];

router.get("/add-product", (req, res, next) => {
  res.render("add-product", {
    pageTitle: "Add Product",
    products,
    path: "/admin/add-product",
  });
});

router.post("/product", (req, res, next) => {
  const { title } = req.body;

  products.push({ title });

  res.redirect("/");
});

exports.routes = router;
exports.products = products;
