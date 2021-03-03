const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const rootDirectory = require("./utils/pathHelper");

const app = express();
const PORT = 3000;

// Set body parser
app.use(bodyParser.urlencoded({ extended: true }));

// Set public folder
app.use(express.static(path.join(__dirname, "public")));

// Set routes
app.use("/admin", require("./routes/adminRoutes"));
app.use(require("./routes/shopRoutes"));

// Set 404 page for unregistered routes
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(rootDirectory, "views", "404.html"));
});

app.listen(PORT, () => console.log(`Server listen on port: ${PORT}`));
