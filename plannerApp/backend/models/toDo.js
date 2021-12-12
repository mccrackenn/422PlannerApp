const mongoose = require("mongoose");

//todomodel
const toDoSchema = mongoose.Schema({
user: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"users"
},  
title: {
    type: String,
    required: true,
},
description: {
    type: String,
    required: true,
},
completed: {
    type: Boolean,
    required: false,
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