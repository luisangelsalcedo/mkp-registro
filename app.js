const express = require("express");
const mongoose = require("mongoose");

// connect
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });
// Schema
const userSchema = {
  name: String,
  email: String,
  password: String,
};
// Model
const User = mongoose.model("User", userSchema);

const app = express();
app.set("view engine", "ejs");

// middleware
app.use(express.urlencoded());

// muestra la lista de usuarios registrados
app.get("/", async (req, res) => {
  const userList = await User.find();
  if (!!userList) {
    console.log(userList);
    res.status(200).render("index.ejs", { usuarios: userList });
  } else {
    res.status(204).send();
  }
});

// muestra el formulario para registrarse
app.get("/register", (req, res) => {
  res.render("formulario.ejs");
});

// crea al usuario en MongoDB.
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const newUser = new User({
    name: name,
    email: email,
    password: password,
  });

  const update = await newUser.save();

  !!update
    ? res.status(200).redirect("/")
    : res.status(500).render("formulario.ejs");
});

app.listen("3000", () => {
  console.log("server run");
});
