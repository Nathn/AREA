const express = require("express");
const router = express.Router();
const GitHubApiHandler = require("../utils/GitHubApiHandler");

const handleBranchOperation = async (req, res, operationType) => {
  const { user, baseValues } = req.body;
  const userBranches = baseValues?.branches;

  const accessToken = user?.auth?.github?.access_token;

  if (!user || !userBranches || !accessToken) {
    res.status(400).send("Bad request");
    return;
  }

  try {
    const prevBranchesSize = userBranches.map((repository) => repository?.length).reduce((a, b) => a + b, 0);

    const githubApiHandler = new GitHubApiHandler(accessToken);
    const githubUser = await githubApiHandler.fetchUser();

    if (!githubUser) {
      res.status(200).send({
        result: result,
        newBaseValues: newBaseValues,
        baseValuesId: "",
      });
      return;
    }

    const publicRepositories = await githubApiHandler.getPublicRepositories();
    const branches = await githubApiHandler.getBranchesForAllPublicRepositories(githubUser.login, publicRepositories);

    const newBranchesSize = branches.map((repository) => repository?.length).reduce((a, b) => a + b, 0);

    let result = false;

    switch (operationType) {
      case "create":
        result = newBranchesSize > prevBranchesSize;
        break;
      case "delete":
        result = newBranchesSize < prevBranchesSize;
        break;
      default:
        break;
    }

    res.status(200).send({
      result: result,
      newBaseValues: branches,
      baseValuesId: "branches",
      reactionNeededBaseValues: null,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
};

router.post("/createBranch", async (req, res) => {
  await handleBranchOperation(req, res, "create");
});

router.post("/deleteBranch", async (req, res) => {
  await handleBranchOperation(req, res, "delete");
});

module.exports = router;
