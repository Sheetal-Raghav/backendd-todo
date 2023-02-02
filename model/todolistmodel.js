const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  todos: [
    {
      activty: { type: String },
      status: { type: String },
      time_taken: { type: String },
      action: { type: String },
    },
  ],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const todoModel = mongoose.model("Todo", Schema);
module.exports = todoModel;
