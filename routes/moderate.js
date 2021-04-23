var express = require("express");
var router = express.Router();

const User = require("../models/user");

//takes a password from the user and then retrieves all the users from the db and dispalys their information on the page.
router.get("/users", function (req, res, next) {
  const reject = () => {
    res.setHeader("www-authenticate", "Basic");
    res.sendStatus(401);
  };

  const authorization = req.headers.authorization;

  if (!authorization) {
    return reject();
  }

  const [username, password] = Buffer.from(
    authorization.replace("Basic ", ""),
    "base64"
  )
    .toString()
    .split(":");

  if (!(password === "admin")) {
    return reject();
  }

  let printUser = `<h1>All Users</h1><a href= />Gå tillbaka</a><ol>`;

  User.find()
    .then((result) => {
      for (user in result) {
        printUser += `<li><ul><li>Användar ID: ${
          result[user].userid
        }</li><li>Email: ${result[user].email}</li><li>Preunumerant: ${
          result[user].subscribed ? "Ja" : "Nej"
        }</li></ul></li>`;
      }
      printUser += "</ol>";
      res.send(printUser);
    })
    .catch((err) => {
      console.log(err);
    });
});

//takes a password from the user and then displays the emails that are subscribed to the newsletter
router.get("/users/subscribed", function (req, res, next) {
  const reject = () => {
    res.setHeader("www-authenticate", "Basic");
    res.sendStatus(401);
  };

  const authorization = req.headers.authorization;

  if (!authorization) {
    return reject();
  }

  const [username, password] = Buffer.from(
    authorization.replace("Basic ", ""),
    "base64"
  )
    .toString()
    .split(":");

  if (!(password === "admin")) {
    return reject();
  }

  let printEmail = `<h1>Subscribed Users</h1><ul><a href= />Gå tillbaka</a></li>`;

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

module.exports = router;
