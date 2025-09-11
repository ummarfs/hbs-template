const express = require("express");
const path = require("path");
const data = require("./data.json");
const hbs = require("hbs");
const { registerBlogDateHelper } = require("./helpers/blogDate");

const app = express();

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

registerBlogDateHelper(hbs);

app.get("/", (req, res) => {
  res.render("index", data);
});

app.listen(3001, () =>
  console.log("👉 Server running at http://localhost:3001")
);
