const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const rootDirectory = require("./utils/pathHelper");

const adminData = require("./routes/admin");
const shopData = require("./routes/shop");

const app = express();
const PORT = 3000;

// Set EJS template engine
app.set("view engine", "ejs");

// Set body parser
app.use(bodyParser.urlencoded({ extended: true }));

// Set public folder
app.use(express.static(path.join(__dirname, "public")));

// Set routes
app.use("/admin", adminData.routes);
app.use("/", shopData.routes);

// Set 404 page for unregistered routes
app.use((req, res, next) => {
  res.status(404).render("404", { pageTitle: "Page Not Found" });
});

app.listen(PORT, () => console.log(`Server listen on port: ${PORT}`));
