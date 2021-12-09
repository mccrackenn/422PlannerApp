const express = require("express");
const app = express();
const mongoose = require("mongoose");
const notesRoute = require("./routes/notes");
const toDosRoute = require("./routes/toDos");
const usersRoute = require("./routes/users");

app.use(express.json());

//This was the reason for the error, lines 14 and 15, the extra added was causing an error in trying to add new notes, delete and edit
mongoose
  .connect(
    //https://docs.mongodb.com/manual/reference/write-concern/    ----What w=majority is
    //"mongodb+srv://mimicuser:mimic1234@cluster0.9vzxz.mongodb.net/Planner?retryWrites=true&w=majority",
    "mongodb+srv://mimicuser:mimic1234@cluster0.9vzxz.mongodb.net/Planner?authSource=admin",
    { useNewUrlParser: true, useUnifiedTopology: true }
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
app.use("/api/todos", toDosRoute);
app.use("/api/users", usersRoute);

module.exports = app;
