const mongoose = require("mongoose");

const toDoSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
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
  createdDate: {
    type: Date,
    required: false,
  },
  listOfItems: { type : Array , "default" : [] }
});

toDoSchema.method("transform", function () {
    var obj = this.toObject();
    obj.id = obj._id;
    delete obj._id;
    return obj;
  });

//Creates objects on the model, first arg is name of model, second is the schema
module.exports = mongoose.model("ToDo", toDoSchema);