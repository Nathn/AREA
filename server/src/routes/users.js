const express = require("express");
const router = express.Router();

const User = require("@/models/User");

router.get("/users", async (req, res) => {
  var users = await User.find({});

  res.send(users);
});

router.post("/register", async (req, res) => {
  try {
    var user = new User({
      uid: req.body.uid,
      name: req.body.name,
      email: req.body.email,
      photoURL: req.body.photoURL,
    });

    await user.save();

    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/users/:uid", async (req, res) => {
  var user = await User.findOne({ uid: req.params.uid });

  for (var service in user.auth) {
    if (user.auth[service] && Object.keys(user.auth[service]).length > 0) {
      user.auth[service] = true;
    } else {
      user.auth[service] = false;
    }
  }

  res.send(user);
});

module.exports = router;
