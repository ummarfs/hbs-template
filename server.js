const express = require("express");
const path = require("path");
const data = require("./data.json"); // import fake API data

const app = express();

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Home page
app.get("/", (req, res) => {
  res.render("index", data);
});


app.listen(3000, () =>
  console.log("👉 Server running at http://localhost:3000")
);
