const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: { type: String },
});

const userModel = mongoose.model("User", Schema);
module.exports = userModel;
