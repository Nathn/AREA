const express = require("express");
const router = express.Router();

const findUserInRequestCookies = require("@/utils/findUserInRequestCookies");

const initUserGithubAuth = async (user) => {
  if (!user.auth) {
    user.auth = {
      github: {},
    };
  }

  if (!user.auth.github) {
    user.auth.github = {};
  }

  try {
    await user.save();
  } catch (error) {
    console.log("Error saving user:", error);
  }
};

router.get("/callback", async (req, res) => {
  const { code } = req.query;
  if (!code) {
    res.status(400).send("Bad request");
    return;
  }

  const user = await findUserInRequestCookies(req);
  if (!user) {
    res.status(400).send("Bad request");
    return;
  }

  const params =
    "?client_id=" +
    process.env.GITHUB_CLIENT_ID +
    "&client_secret=" +
    process.env.GITHUB_CLIENT_SECRET +
    "&code=" +
    code +
    "&scope=user%20public_repo";

  const response = await fetch(
    "https://github.com/login/oauth/access_token" + params,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    }
  );

  const data = await response.json();
  const { access_token } = data;
  if (!access_token) {
    res.status(400).send("Bad request");
    return;
  }

  try {
    if (!user.auth) await initUserGithubAuth(user);

    user.auth.github = data;

    await user.save();

    res.redirect(`${process.env.FRONT_URL}/new`);
  } catch (error) {
    console.log("Error saving user:", error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
