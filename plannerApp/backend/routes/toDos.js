const express = require("express");
const router = express.Router();
const ToDo = require("../models/toDo");

router.get("", (req, res, next) => {
    ToDo.find().then((documents) => {
        let returnedDocuments = [];
        //Don't want the returned Array to have a _id key, want id, this loops through
        //and replaces the id. Method is in the Mongoose Model
        for (let i = 0; i < documents.length; i++) {
        returnedDocuments.push(documents[i].transform());
        //console.log(returnedDocuments);
        }
        res.status(200).json(returnedDocuments);
    })
    .catch((error) => {
        res.status(500).json({
        message: "Error replacing ID",
        });
    });
});

router.get("/:id", (req, res, next) => {
    console.log(req.params.id);
    ToDo.findById(req.params.id).then((toDo) => {
        if (toDo) {
            console.log("Here");
            let changedToDo = toDo.transform();
            console.log(changedToDo);
            res.status(200).json(changedToDo);
        } else {
            res.status(404).json({ message: "ToDo not found" });
        }
    })
    .catch((error) => {
        res.status(500).json({
        message: "Fetching ToDo failed! " + error,
        });
    });
});

//todomodel
router.post("", (req, res, next) => {
    const { title, description, completed, startDateTime, endDateTime, createdDate } = req.body.toDo;
    console.log(title);
    console.log(req.body._id);
    const myToDo = new ToDo({
        title: req.body.toDo.title,
        description: req.body.toDo.description,
        completed: req.body.toDo.completed,
        startDateTime: req.body.toDo.startDateTime,
        endDateTime: req.body.toDo.endDateTime,
        createdDate: req.body.toDo.createdDate,
        user: req.body._id,
    });
    console.log(myToDo);
    myToDo.save().then((createdToDo) => {
        res.status(201).json({
        message: "successfully added new ToDo to DB",
        toDoId: createdToDo._id,
        });
    })
    .catch((error) => {
        console.log(error)
        //This is a workaround to an error encountered from hosting on Azure and extra code we had to put into the URI string in app.js (authSource=admin),
        //todo saves to Mongo but generates this error, catching and acknowldeging but continuing since this is not really a problem
        if(error.result.writeConcernError['code'] === 79){
          res.status(201).json({
            message:"Threw write concern error but saved",
            noteId: myToDo._id
          })
        }else{
          res.status(500).json({
            message: "Creating a ToDo failed",
          });
        }
    });
});

router.post("/:id", (req, res, next) => {
    console.log("Arrived at the new Get Request");
    console.log(req.params.id);
    const myToDos = ToDo.find({ user: req.params.id }, (err, result) => {
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
    const toDo = new ToDo({
        _id: req.body.id,
        title: req.body.title,
        description: req.body.description,
        completed: req.body.completed,
        startDateTime: req.body.startDateTime,
        endDateTime: req.body.endDateTime,
        createdDate: req.body.createdDate,
    });
    ToDo.updateOne({ _id: req.params.id }, toDo)
        .then((result) => {
            console.log(result);
            if (result.modifiedCount > 0) {
                res.status(200).json({ message: "Post Succesfully Updated" });
            }
        })
        .catch((error) => {
            res.status(500).json({
            message: "Could not update ToDo",
        });
    });
});

router.delete("/:id", (req, res, next) => {
    //console.log(req.params);
    ToDo.deleteOne({ _id: req.params.id }).then((result) => {
        if (result.deletedCount == 1) {
            res.status(200).json({ message: "ToDo Deleted" });
        } else {
            res.status(404).json({ message: "Error, ToDo not found" });
        }
    });
});

module.exports = router;
