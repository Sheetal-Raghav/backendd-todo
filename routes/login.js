const express = require("express");
const route = express.Router();
const bcrypt = require("bcrypt");
const user = require("../model/userModel");
const jwt = require("jsonwebtoken");
const secret = "SECRET";

route.use(express.json());
route.use(express.urlencoded({ extended: true }));

route.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;
    const userData = await user.findOne({ username: username });
    if (userData !== null) {
      const isPasswordCorrect = await bcrypt.compare(
        password,
        userData.password
      );
      if (isPasswordCorrect) {
        const token = jwt.sign(
          {
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
            data: userData._id,
          },
          secret
        );
        res.status(200).json({
          Status: "Success",
          message: token,
        });
      } else {
        res.status(500).json({
          Status: "failed",
          message: "Incorrect Password",
        });
      }
    } else {
      res.status(500).json({
        Status: "failed",
        message: "User Doesn't Exists",
      });
    }
  } catch (error) {
    res.status(400).json({
      Status: "failed",
      message: error.message,
    });
  }
});

route.get("*", (req, res) => {
  res.status(404).json({
    message: "Path Not Found",
  });
});

module.exports = route;
