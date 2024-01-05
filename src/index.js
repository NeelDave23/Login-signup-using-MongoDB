const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const templatePath = path.join(__dirname, "../tempelates");
const collection = require("./mongodb");
const bcrypt = require("bcrypt");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "hbs");
app.set("views", templatePath);

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", async (req, res) => {
  let data = {
    name: req.body.name,
    password: req.body.password,
  };
  try {
    const hash = await bcrypt.hash(data.password, 10);
    data.password = hash;
    console.log(hash);
    await collection.insertMany([data]);
    res.render("home", { data });
  } catch {
    res.send("error");
  }
});

app.post("/login", async (req, res) => {
  try {
    let data = {
      name: req.body.name,
      password: req.body.password,
    };
    const check = await collection.findOne({ name: req.body.name });
    const checkPass = await bcrypt.compare(req.body.password, check.password);
    if (checkPass) {
      res.render("home", { data });
    } else {
      res.send("Wrong Password");
    }
  } catch {
    res.send("Wrong details");
  }
});

app.listen(3000, () => {
  console.log("Listering on 3000");
});
