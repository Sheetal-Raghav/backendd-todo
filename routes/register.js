const express = require("express");
const route = express.Router();
const bcrypt = require("bcrypt");
const user = require("../model/userModel");
const { body, validationResult } = require("express-validator");

route.use(express.json());
route.use(express.urlencoded({ extended: true }));

route.post("/", body("password"), body("username"), async (req, res) => {
  try {
    const { username, password } = req.body;
    const repeatedUser = await user.find({ username: username });
    if (repeatedUser.length === 0) {
      const err = validationResult(req);
      if (!err.isEmpty()) {
        res.status(500).json({
          Status: "failed by validator",
          message: err.array(),
        });
      } else {
        const salt = await bcrypt.genSalt(12);
        bcrypt.hash(password, salt, async (err, hash) => {
          if (err) console.log(err);
          else
            await user.create({
              username: username,
              password: hash,
            });
        });
        res.status(200).json({
          Status: "Success",
          message: "Please Login",
        });
      }
    } else {
      res.status(500).json({
        Status: "failed",
        message: "User Already Exists",
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
