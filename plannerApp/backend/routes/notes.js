const express = require("express");
const router = express.Router();
const Note = require("../models/note");

router.get("", (req, res, next) => {
  Note.find().then((documents) => {
    let returnedDocuments = [];
    //Don't want the returned Array to have a _id key, want id, this loops through
    //and replaces the it. Method is in the Mongoose Model
    for (let i = 0; i < documents.length; i++) {
      // const dateCheck= documents[i].createdDate;
      //console.log(typeof dateCheck)
      returnedDocuments.push(documents[i].transform());
      //console.log(returnedDocuments);
    }
    res.status(200).json(returnedDocuments);
  });
});

router.get("/:id", (req, res, next) => {
  console.log(req.params.id);
  Note.findById(req.params.id).then((note) => {
    if (note) {
      let changedNote = note.transform();
      console.log(changedNote);
      res.status(200).json(changedNote);
    } else {
      res.status(404).json({ message: "Note not found" });
    }
  });
});

router.post("", (req, res, next) => {
  const newNote = new Note({
    title: req.body.title,
    description: req.body.description,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    createdDate: req.body.createdDate,
  });
  newNote.save().then((createdNote) => {
    res.status(201).json({
      message: "successfully added new Note to DB",
      noteId: createdNote._id,
    });
  });
});

router.put("/:id", (req, res, next) => {
  console.log(req.body)
  const note=new Note({
    _id:req.body.id,
    title:req.body.title,
    description:req.body.description,
    startDate:req.body.startDate,
    endDate:req.body.endDate,
    createdDate:req.body.createdDate
  });
  Note.updateOne({_id:req.params.id},note).then(result => console.log(result))
  /*

router.put("/:id", (req, res, next) => {
  console.log(req.params.id);
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
  });
  Post.updateOne({ _id: req.params.id }, post).then((result) => {
    console.log(result);
    res.status(200).json({ message: "Update Successfull" });
  });
});

  const newNote = new Note({
    title: req.body.title,
    description: req.body.description,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    createdDate: req.body.createdDate,
  });

  newNote.save().then((createdNote) => {
    res.status(201).json({
      message: "successfully added new Note to DB",
      noteId: createdNote._id,
    });
  });*/
});

router.delete("/:id", (req, res, next) => {
  //console.log(req.params);
  Note.deleteOne({ _id: req.params.id }).then((result) => {
    res.status(200).json({ message: "Note Deleted" });
  });
});

// {id:1,title:"My First Note",description:"My First Test Note",createdDate:new Date(2021,10,5),startDate:new Date(),endDate:new Date()},
// {id:2,title:"My Second Note",description:"My Second Test Note",createdDate:new Date(2021,9,18),startDate:new Date(),endDate:new Date()}
module.exports = router;
