const mongoose = require("mongoose");

//todomodel
const toDoSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true, //q? make this false in case they only want a simple title?
  },
  completed: {
    type: Boolean,
    required: false, //q? does this mean it will be set by the model constructor?
  },
  createdDate: {
    type: Date,
    required: false,
  },
  startDateTime: {
    type: Date,
    required: true,
  },
  endDateTime: {
    type: Date,
    required: true,
  },
  
});

toDoSchema.method("transform", function () {
    var obj = this.toObject();
    obj.id = obj._id;
    delete obj._id;
    return obj;
  });

//Creates objects on the model, first arg is name of model, second is the schema
module.exports = mongoose.model("ToDo", toDoSchema);