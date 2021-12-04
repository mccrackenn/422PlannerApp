const mongoose = require("mongoose");

const noteSchema = mongoose.Schema({
  // id: {
  //   type: String,
  //   required: false,
  // },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },

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
});

//https://ozenero.com/mongoose-change-_id-to-id-in-returned-response-node-js-express-application-example
noteSchema.method("transform", function () {
  var obj = this.toObject();
  obj.id = obj._id;
  delete obj._id;
  return obj;
});

//Creates objects on the model, first arg is name of model, second is the schema
module.exports = mongoose.model("Note", noteSchema);
