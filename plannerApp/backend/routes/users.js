const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/:id", (req, res, next) => {
  console.log(req.params.id);
  const email = req.params.id;
  User.findOne({email:email},(error, result)=>{
    if(error){
      console.log(error)
    }
    else{
      console.log(result)
    }
    res.status(200).json(result)
  })



});

module.exports = router;
