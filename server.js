const express = require("express");
const path = require("path");
const data = require("./data.json");
const hbs = require("hbs");

const app = express();

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

hbs.registerHelper("firstChar", function (str) {
  return str ? str.toUpperCase().charAt(0) : "";
});

hbs.registerHelper("currentYear", function () {
  return new Date().getFullYear();
});

hbs.registerHelper("default", (v, fb) =>
  v === undefined || v === null || v === "" ? fb : v
);

app.get("/", (req, res) => {
  res.redirect("/2");
});

app.get("/1", (req, res) => {
  res.render("1", data);
});

app.get("/2", (req, res) => {
  res.render("2", data);
});

app.get("/3", (req, res) => {
  res.render("3", data);
});

app.get("/4", (req, res) => {
  res.render("4", data);
});

app.listen(3001, () =>
  console.log("👉 Server running at http://localhost:3001")
);
