const express = require('express');
const router = express.Router();

const User = require('@/models/User');

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

module.exports = router;
