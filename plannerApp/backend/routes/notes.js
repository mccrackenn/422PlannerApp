const express = require("express");
const router = express.Router();
const Note = require("../models/note");

router.get("", (req, res, next) => {
  Note.find().then((documents) => {
    console.log(documents);
    res.status(200).json(documents);
  });
});

// {id:1,title:"My First Note",description:"My First Test Note",createdDate:new Date(2021,10,5),startDate:new Date(),endDate:new Date()},
// {id:2,title:"My Second Note",description:"My Second Test Note",createdDate:new Date(2021,9,18),startDate:new Date(),endDate:new Date()}
module.exports = router;
