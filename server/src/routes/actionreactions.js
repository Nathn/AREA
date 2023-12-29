const express = require("express");
const router = express.Router();

const User = require("@/models/User");

const findUserInRequestCookies = async (req) => {
  try {
    const cookiesUser = JSON.parse(req.cookies.user);
    if (!cookiesUser) {
      return null;
    }

    const user = await User.findOne({ uid: cookiesUser.uid });
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
};

router.post("/createActionReaction/:action/:reaction", async (req, res) => {
  const { action, reaction } = req.params;
  const user = await findUserInRequestCookies(req);
  if (!user) {
    res.status(400).send("Bad request");
    return;
  }
  if (
    user.action_reactions.some(
      (ar) => ar.action === action && ar.reaction === reaction
    )
  ) {
    res
      .status(201)
      .send("This action/reaction is already active on your account");
    return;
  }
  try {
    user.action_reactions.push({ action: action, reaction: reaction });
    await user.save();
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

router.post("/deleteActionReaction/:id", async (req, res) => {
  const { id } = req.params;
  const user = await findUserInRequestCookies(req);
  if (!user) {
    res.status(400).send("Bad request");
    return;
  }
  if (
    !user.action_reactions.some((ar) => {
      return ar._id.toString() === id;
    })
  ) {
    res.status(201).send("This action/reaction is not active on your account");
    return;
  }
  try {
    user.action_reactions = user.action_reactions.filter((ar) => {
      return ar._id.toString() !== id;
    });
    await user.save();
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

module.exports = router;
