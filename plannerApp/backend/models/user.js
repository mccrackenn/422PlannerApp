const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({

  email: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: false
  },
  imageUrl: {
    type: String,
    required: false
  }

});

module.exports = mongoose.model("users", UserSchema);
