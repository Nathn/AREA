const express = require("express");
const router = express.Router();
const GitHubApiHandler = require("../utils/GitHubApiHandler");

router.post("/updateRepo", async (req, res) => {
  const { user, baseValues } = req.body;

  const accessToken = user?.auth?.github?.access_token;

  if (!user || !baseValues || !accessToken) {
    res.status(400).send("Bad request");
    return;
  }
  try {
    const githubApiHandler = new GitHubApiHandler(accessToken);
    for (const repoCommit of baseValues) {
      const { repository, commit } = repoCommit;

      const currentDate = new Date();
      const dateAndTime = currentDate.toLocaleString("fr-FR", {
        timeZone: "Europe/Paris",
      });

      const description = "Repository updated at " + dateAndTime + " with commit " + commit?.sha;

      const owner = repository?.url?.split("/")[3];

      const responseData = await githubApiHandler.updateRepositoryDescription(owner, repository.name, description);
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
