"use strict";
const express = require("express");
let router = express.Router();

router.route("/signup").get((req, res) => {
  res.render("signup", { x: "vincent aF!@#" });
});

router.route("/signup").post((req, res) => {
  let username = req.body.username;
  let password = req.body.userpass;

  let newUser = new User({
    username: username,
    password: password
  });

  newUser.save(function(err) {
    if (err) throw err + "NOT SAVING";
    else {
      res.cookie("user", username, { maxAge: 360000 });
      res.render("chatroom");
    }
  });
});

router
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post((req, res) => {
    let username = req.body.username;
    let password = req.body.userpass;
    User.getAuthenticated(username, password, function(err, user) {
      if (err) throw err;
      if (user) {
        res.cookie("user", username, { maxAge: 360000 });
        res.render("chatroom", { username: username });
      }
    });
  });

router.get("/logout", function(req, res) {
  res.clearCookie("user");
  res.render("logout");
});

module.exports = router;
