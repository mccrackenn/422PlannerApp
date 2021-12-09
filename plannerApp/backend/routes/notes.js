const express = require("express");
const { title } = require("process");
const router = express.Router();
const Note = require("../models/note");

router.get("", (req, res, next) => {
  Note.find()
    .then((documents) => {
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
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching Posts failed!",
      });
    });
});

router.get("/:id", (req, res, next) => {
  console.log(req.params.id);
  Note.findById(req.params.id)
    .then((note) => {
      if (note) {
        let changedNote = note.transform();
        console.log(changedNote);
        res.status(200).json(changedNote);
      } else {
        res.status(404).json({ message: "Note not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching Posts failed!",
      });
    });
});

router.post("", (req, res, next) => {
  const { title, description, startDate, endDate, createdDate } = req.body.note;
  console.log(title);
  console.log(req.body._id);
  const myNote = new Note({
    title: req.body.note.title,
    description: req.body.note.description,
    startDate: req.body.note.startDate,
    endDate: req.body.note.endDate,
    createdDate: req.body.note.createdDate,
    user: req.body._id,
    // title,
    // description,
    // startDate,
    // endDate,
    // createdDate,
    // user:req.body._id
  });
  console.log(myNote);
  myNote
    .save()
    .then((createdNote) => {
      console.log(createdNote);
      res.status(201).json({
        message: "successfully added new Note to DB",
        noteId: createdNote._id,
      });
    })
    .catch((error) => {
      console.log(error)
      //This is a workaround to an error encountered from hosting on Azure and extra code we had to put into the URI string in app.js (authSource=admin),
      //note saves to Mongo but generates this error, catching and acknowldeging but continuing since this is not really a problem
      if(error.result.writeConcernError['code'] === 79){
        res.status(201).json({
          message:"Threw write concern error but saved",
          noteId: myNote._id
        })
      }else{
        res.status(500).json({
          message: "Creating a note failed",
        });
      }

    });
});
// .then((createdNote) => {

//   res.status(201).json({
//     message: "successfully added new Note to DB",
//     noteId: createdNote._id,
//   });
// })
// .catch((error) => {
//   res.status(500).json({
//     message: "Creating a note failed",
//   });
// });

router.post("/:id", (req, res, next) => {
  console.log("Arrived at the new Get Request!!!");
  console.log(req.params.id);
  const myNotes = Note.find({ user: req.params.id }, (err, result) => {
    if (err) {
      console.log(err + "This is a get request disguised as a Post");
    } else {
      let transformedResult = [];
      for (let i = 0; i < result.length; i++) {
        transformedResult.push(result[i].transform());
      }
      res.status(200).json(transformedResult);
    }
  });
});

router.put("/:id", (req, res, next) => {
  console.log(req.body);
  const note = new Note({
    _id: req.body.id,
    title: req.body.title,
    description: req.body.description,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    createdDate: req.body.createdDate,
  });
  Note.updateOne({ _id: req.params.id }, note)
    .then((result) => {
      console.log(result);
      if (result.modifiedCount > 0) {
        res.status(200).json({ message: "Post Succesfully Updated" });
      } else {
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Could not update Note",
      });
    });
});
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

router.delete("/:id", (req, res, next) => {
  console.log(req.params);
  Note.deleteOne({ _id: req.params.id }).then((result) => {
    if (result.deletedCount == 1) {
      res.status(200).json({ message: "Note Deleted" });
    } else {
      res.status(404).json({ message: "Error, note not found" });
    }
  });
});
// User.deleteOne({ age: { $gte: 10 } }).then(function(){
//   console.log("Data deleted"); // Success
// }).catch(function(error){
//   console.log(error); // Failure
// });

// Post.findById(req.params.id).then((post) => {
//   if (post) {
//     res.status(200).json(post);
//   } else {
//     res.status(404).json({ message: "POST NOT HERE" });
//   }
// });

module.exports = router;
