var express = require("express");
var router = express.Router();
const fs = require("fs");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const User = require("../models/user");
const app = require("../app");
const url =
  "mongodb+srv://axel:axel@cluster0.tcmv1.mongodb.net/Nyhetsbrev?retryWrites=true&w=majority";
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => console.log("connected"))
  .catch((err) => console.log("error"));

router.use(cors());

router.get("/", function (req, res, next) {
  let printEmail = `<h1>Subscribed Users</h1><ul>`;

  User.find()
    .then((result) => {
      for (user in result) {
        if (result[user].subscribed === true) {
          printEmail += `<li>${result[user].email}</li>`;
        }
      }
      printEmail += "</ul>";
      res.send(printEmail);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/new-user", (req, res) => {
  let findUser = async () => {
    let found = await User.find({ email: req.body.email });
    return found;
  };

  let found = findUser();
  found.then((data) => {
    if (data.length != 0) {
      res.send(true);
    } else {
      let newUser = new User();

      newUser.passWord = req.body.passWord;
      newUser.email = req.body.email;
      newUser.subscribed = req.body.subscribed;
      newUser.userid = uuidv4();
      console.log("new user created");
      newUser
        .save()
        .then((result) => {
          res.send(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
});

router.post("/log-in", function (req, res) {
  let findUser = async () => {
    let found = await User.find({ email: req.body.email });
    return found;
  };

  let found = findUser();
  found.then((data) => {
    if (
      data[0].passWord == req.body.passWord &&
      data[0].email == req.body.email
    ) {
      res.send(data);
    } else {
      res.send(false);
    }
  });
});

router.post("/update-sub", function (req, res) {
  let index = { userid: req.body.userid };
  let update = { subscribed: req.body.subscribed };
  User.findOneAndUpdate(index, update).catch((err) => console.log(err));
});

router.get("/all-users", function (req, res) {});

module.exports = router;
