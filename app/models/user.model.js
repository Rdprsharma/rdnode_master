const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    mobile: String,
    password: String,
    bio:String,
    token:String
  })
);

module.exports = User;
