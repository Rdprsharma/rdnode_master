const mongoose = require("mongoose");

const userVideo = mongoose.model(
  "userVideo",
  new mongoose.Schema({
    title: String,
    description: String,
    video: String,
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  })
);

module.exports = userVideo;