const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true },
  passWord: { type: String, required: true },
  subscribed: { type: Boolean, required: true },
  userid: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
