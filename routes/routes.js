const express = require("express");
const route = express.Router();
const todoModel = require("../model/todolistmodel");
const jwt = require("jsonwebtoken");
const secret = "SECRET";

route.use(express.json());
route.use(express.urlencoded({ extended: true }));


route.post("/", async (req, res) => {
  let id;
  jwt.verify(req.headers.token, secret, (err, user) => {
    if (err) console.log(err.message);
    id =  user.data;
  });
  try {
    let userdata = await todoModel.find({ user: id });
    console.log(userdata.length);
    if (userdata.length > 0) {
      userdata = await todoModel.find({ user: id }).updateOne(
        {},
        {
          $push: {
            todos: req.body,
          },
        }
      );
    } else {
      userdata = await todoModel.create({
        todos: req.body,
        user: id,
      });
    }
    res.status(200).json({
      Status: "Sucess",
      message: userdata,
    });
  } catch (error) {
    res.status(400).json({
      Status: "failed",
      message: error.message,
    });
  }
});


route.get("/", async (req, res) => {
  let id;
  if (req.headers.token !== null) {
    jwt.verify(req.headers.token, secret, (err, user) => {
      if (err) console.log(err.message);
      else id = user.data;
    });
    try {
      const data = await todoModel.find({ user: id });
      res.status(200).json({
        status: "Sucess",
        message: data,
      });
    } catch (error) {
      res.status(500).json({
        status: "Failed",
        message: error.message,
      });
    }
  } else {
    res.status(500).json({
      status: "Failed",
      message: "Please Refresh the Page",
    });
  }
});


route.put("/:id", async (req, res) => {
  const { activty, status, time_taken, action } = req.body;
  let id;
  jwt.verify(req.headers.token, "SECRET", (err, user) => {
    if (err) console.log(err.message);
    id = user.data;
  });
  try {
    let data = await todoModel.updateOne(
      { user: id, "todos._id": req.params.id },
      {
        $set: {
          "todos.$.activty": activty,
          "todos.$.status": status,
          "todos.$.time_taken": time_taken,
          "todos.$.action": action,
        },
      }
    );
    res.status(200).json({
      status: "Sucess",
      message: data,
    });
  } catch (error) {
    res.status(500).json({
      status: "Edit Failed",
      message: error.message,
    });
  }
});


route.delete("/:id", async (req, res) => {
  let id;
  jwt.verify(req.headers.token, "SECRET", (err, user) => {
    if (err) console.log(err.message);
    id = user.data;
  });
  try {
    let data = await todoModel.updateOne(
      { user: id },
      { $pull: { todos: { _id: req.params.id } } }
    );
    res.status(200).json({
      status: "Sucess",
      message: data,
    });
  } catch (error) {
    res.status(500).json({
      status: "Delete Failed",
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
