const mongoose = require("mongoose");

const toDoSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
});

//Creates objects on the model, first arg is name of model, second is the schema
module.exports = mongoose.model("Note", noteSchema);