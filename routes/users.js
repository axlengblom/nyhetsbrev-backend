var express = require("express");
var router = express.Router();
const fs = require("fs");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const url =
  "mongodb+srv://axel:axel@cluster0.tcmv1.mongodb.net/Nyhetsbrev?retryWrites=true&w=majority";
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => console.log("connected"))
  .catch((err) => console.log("error"));
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  subscribed: { type: Boolean, required: true },
  userid: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

router.use(cors());

let users = [];

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/new", function (req, res) {
  let newUser = new User();

  newUser.firstName = req.body.firstName;
  newUser.lastName = req.body.lastName;
  newUser.email = req.body.email;
  newUser.subscribed = req.body.subscribed;
  newUser.userid = uuidv4();

  console.log(newUser);

  fs.readFile("users.json", function (err, data) {
    if (err) {
      console.log(err);
    }

    let users = JSON.parse(data);
    users.push(newUser);

    fs.writeFile("users.json", JSON.stringify(users, null, 2), function (err) {
      if (err) {
        console.log(err);
      }
    });
  });
  newUser
    .save()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
