const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  mobile: { type: String, default: '', required: false },
  address: { type: String, default: '',required: false },
  image: { type: String, default: '' },
});

const User = mongoose.model("users", UserSchema);

module.exports = User;