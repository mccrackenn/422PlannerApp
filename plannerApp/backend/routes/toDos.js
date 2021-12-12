const express = require("express");
const router = express.Router();
const ToDo = require("../models/toDo");

router.get("", (req, res, next) => {
  ToDo.find().then((documents) => {
    let returnedDocuments = [];
    //Don't want the returned Array to have a _id key, want id, this loops through
    //and replaces the it. Method is in the Mongoose Model
    for (let i = 0; i < documents.length; i++) {
      returnedDocuments.push(documents[i].transform());
      //console.log(returnedDocuments);
    }
    res.status(200).json(returnedDocuments);
  });
});

router.get("/:id", (req, res, next) => {
  console.log(req.params.id);
  ToDo.findById(req.params.id).then((toDo) => {
    if (toDo) {
      res.status(200).json(toDo);
    } else {
      res.status(404).json({ message: "ToDo not found" });
    }
  });
});

//todomodel
router.post("", (req, res, next) => {
  const newToDo = new ToDo({
    title: req.body.title,
    description: req.body.description,
    completed: req.body.completed,
    createdDate: req.body.createdDate,
    startDateTime: req.body.startDateTime,
    endDateTime: req.body.endDateTime,
  });
  newToDo.save().then((createdToDo) => {
    res.status(201).json({
      message: "successfully added new ToDo to DB",
      toDoId: createdToDo._id,
    });
  });
});

router.delete("/:id", (req, res, next) => {
  //console.log(req.params);
  ToDo.deleteOne({ _id: req.params.id }).then((result) => {
    res.status(200).json({ message: "ToDo Deleted" });
  });
});

module.exports = router;
