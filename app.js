var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");

const url =
  "mongodb+srv://axel:axel@cluster0.tcmv1.mongodb.net/Nyhetsbrev?retryWrites=true&w=majority";
mongoose

  //connects to the database
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => console.log("connected"))
  .catch((err) => console.log("error"));

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var moderateRouter = require("./routes/moderate");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/moderate", moderateRouter);

module.exports = app;
