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

app.get("/",(req,res)=>{
  res.redirect("/3");
})

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

app.listen(3001, () =>
  console.log("👉 Server running at http://localhost:3001")
);
