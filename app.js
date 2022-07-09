require("dotenv").config();
require("./config/database").connet();
const express = require("express");
const user = require("./model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const auth = require("./middleware/auth");
const app = express();

app.use(express.json());

const User = require("./model/user");

//Register
app.post("/register", async (req, res) => {
  try {
    //user inputs
    const { first_name, last_name, email, password } = req.body;

    if (!(email && password && first_name && last_name)) {
      res.status(400).send("All inputs fields are required");
    }

    //check if user already exists
    const oldUser = await User.findOne({ email });
    if (oldUser) res.status(409).send("User Already exists. Please Login");

    //Encrypt password
    encryptedPassword = await bcrypt.hash(password, 10);

    //Create user in DB
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      { expiresIn: "2h" }
    );
    user.token = token;
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
  }
});
//login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).send("All inputs is required");
    }
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      //Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        { expiresIn: "2h" }
      );
      user.token = token;
      res.status(200).json(user);
    }
    res.status(400).send("Invalid credentials");
  } catch (error) {
    console.log(error);
  }
});
app.get("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome");
});

module.exports = app;
