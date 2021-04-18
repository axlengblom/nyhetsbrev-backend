var express = require("express");
var router = express.Router();
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const saltRounds = 10;

router.use(cors());

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
      let passHash = bcrypt.hashSync(req.body.passWord, saltRounds);

      newUser.email = req.body.email;
      newUser.passWord = passHash;
      newUser.subscribed = req.body.subscribed;
      newUser.userid = uuidv4();

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
    if (bcrypt.compareSync(req.body.passWord, data[0].passWord)) {
      data[0].passWord = undefined;

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

module.exports = router;
