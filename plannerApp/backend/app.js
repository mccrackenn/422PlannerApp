const express = require("express");
const app = express();
const mongoose = require("mongoose");
const notesRoute = require("./routes/notes");

app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://mimicuser:mimic1234@cluster0.9vzxz.mongodb.net/Planner?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("connected to database");
  })
  .catch(() => {
    console.log("Connection Failed");
  });

//"http://localhost:4200"
app.use((req, res, next) => {
  // "*", no matter which domain the app is running on, it is allowed to access resources
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept"
  );
  //Control which HTTP verbs can be used
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );

  next();
});

app.use("/api/notes", notesRoute);

module.exports = app;
