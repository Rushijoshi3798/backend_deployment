const express = require("express");
const { UserModel } = require("../model/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userRouter = express.Router();

//registartion

userRouter.post("/register", async (req, res) => {
  console.log(req.body);
  const { email, pass, location, age } = req.body;
  try {
    bcrypt.hash(pass, 5, async (err, hash) => {
      const user = new UserModel({ email, pass: hash, location, age });
      await user.save();
      res.status(200).send({ msg: "registration has been done!" });
    });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

//login (authentication)
userRouter.post("/login", async (req, res) => {
  const { email, pass } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    console.log(user);
    if (user) {
      bcrypt.compare(pass, user.pass, (err, result) => {
        if (result) {
          res.status(200).send({
            msg: "login successful",
            token: jwt.sign({ userID: user._id }, "masai"),
          });
          // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb3Vyc2UiOiJiYWNrZW5kIiwiaWF0IjoxNjc5NTAzODEzfQ.L3b3P0J2ZkAQs4CIErKNlpKImYnZ3IyGmtA-2nuh80k
        } else {
          res.status(400).send({ msg: "login failed" });
        }
      });
    }
  } catch (error) {
    res.status(400).send({ msg: "login Not verified" });
  }
});

userRouter.get("/details", (req, res) => {
  const token = req.headers.authorization;
  jwt.verify(token, "masai", function (err, decoded) {
    decoded
      ? res.status(200).send("User details")
      : res.status(400).send({ msg: err.message });
  });
});

userRouter.get("/moviesData", (req, res) => {
  const token = req.headers.authorization;
  jwt.verify(token, "masai", function (err, decoded) {
    decoded
      ? res.status(200).send("Moviessss details")
      : res
          .status(400)
          .send({ msg: "You are not authorized to use this route" });
  });
});

module.exports = {
  userRouter,
};
