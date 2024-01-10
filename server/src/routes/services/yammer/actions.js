const express = require("express");
const router = express.Router();

// Variable to store previous baseValues
let previousBaseValues = {};
// Exemple baseValues :       baseValues[message.id] = message.body.plain;

router.post("/sendMessage", async (req, res) => {
  const { user, baseValues } = req.body;

  if (!user || !baseValues) {
    res.status(400).send("Bad request");
    return;
  }

  try {
    // Compare with previous baseValues to find differences
    const baseValuesChanged = JSON.stringify(baseValues) !== JSON.stringify(previousBaseValues);

    if (baseValuesChanged) {
      // Perform action if baseValues are different
      console.log("BaseValues have changed. Performing action...");
      console.log("BaseValues:", baseValues);
      console.log("Previous BaseValues:", previousBaseValues);
    }

    const result = true;

    // Update previousBaseValues with the latest baseValues
    previousBaseValues = { ...baseValues };

    res.status(200).send({
      result: result,
      newBaseValues: previousBaseValues,
      baseValuesId: "sentMessages",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
