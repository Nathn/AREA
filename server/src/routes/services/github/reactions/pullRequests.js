const express = require("express");
const router = express.Router();
const GitHubApiHandler = require("../utils/GitHubApiHandler");

router.post("/commentPullRequest", async (req, res) => {
  const { user, baseValues } = req.body;

  const accessToken = user?.auth?.github?.access_token;

  if (!user || !baseValues || !accessToken) {
    res.status(400).send("Bad request");
    return;
  }
  try {
    const githubApiHandler = new GitHubApiHandler(accessToken);

    for (const pullRequest of baseValues) {
      const currentDate = new Date();
      const dateAndTime = currentDate.toLocaleString("fr-FR", {
        timeZone: "Europe/Paris",
      });

      const comment = "Pull request (re)opened at " + dateAndTime;

      const owner = pullRequest?.url?.split("/")[4];
      const repository = pullRequest?.url?.split("/")[5];

      const responseData = await githubApiHandler.commentPullRequest(owner, repository, pullRequest.number, comment);
      if (!responseData) {
        res.status(400).send("Bad request");
        return;
      }
    }

    res.status(200).send("OK");
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

module.exports = router;
