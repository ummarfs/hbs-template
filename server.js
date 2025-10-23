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

hbs.registerHelper("inc", function (value) {
  return parseInt(value) + 1;
});

hbs.registerHelper("splitText", function (text, options) {
  if (!text) return "";

  const words = text.split(" ");
  const half = Math.ceil(words.length / 2);

  const firstHalf = words.slice(0, half).join(" ");
  const secondHalf = words.slice(half).join(" ");

  return options.fn({ firstHalf, secondHalf });
});

hbs.registerHelper("lt", function (a, b) {
  return a < b;
});

hbs.registerHelper("gt", function (a, b) {
  return a > b;
});

app.get("/", (req, res) => {
  res.redirect("/6");
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

app.get("/5", (req, res) => {
  res.render("5", data);
});

app.get("/6", (req, res) => {
  res.render("6", data);
});

app.listen(3001, () =>
  console.log("👉 Server running at http://localhost:3001")
);
