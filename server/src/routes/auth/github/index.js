const express = require("express");
const router = express.Router();

router.get("/callback", async (req, res) => {
  console.log("Cookies: ", req.cookies);
});

module.exports = router;
