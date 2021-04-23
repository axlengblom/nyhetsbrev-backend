var express = require("express");
var router = express.Router();
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const saltRounds = 10;

router.use(cors());

//looks if there already is a user with the same email, if so sends a false, if not it sends a confirmation with the information of the user and posts it to mongo db, also assigns a userid and an encrypted password
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
          res.send(newUser);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
});

//Receives the user information, finds the email in the db and compares the passwords
router.post("/log-in", (req, res) => {
  let findUser = async () => {
    let found = await User.find({ email: req.body.email });
    return found;
  };

  let found = findUser();
  found.then((data) => {
    if (data.length == 0) {
      res.send(false);
    } else {
      if (bcrypt.compareSync(req.body.passWord, data[0].passWord)) {
        data[0].passWord = undefined;

        res.send(data);
      } else {
        res.send(false);
      }
    }
  });
});

//finds the user by userid and then sends the updated information to the database
router.post("/update-sub", (req, res) => {
  let index = { userid: req.body.userid };
  let update = { subscribed: req.body.subscribed };
  User.findOneAndUpdate(index, update)
    .then((data) => {
      let findUser = async () => {
        let found = await User.find({ userid: req.body.userid });
        return found;
      };
      let found = findUser();
      found.then((data) => {
        data[0].passWord = undefined;
        res.send(data);
      });
    })
    .catch((err) => console.log(err));
});

//gets the userid from the front-end and sends the information retrieved from the db to the front-end
router.post("/validate-logged-in-user", (req, res) => {
  let findUser = async () => {
    let found = await User.find({ userid: req.body.userid });
    return found;
  };
  let found = findUser();
  found.then((data) => {
    data[0].passWord = undefined;
    res.send(data);
  });
});

module.exports = router;
