const express = require("express");
const axios = require("axios");

const router = express.Router();

// NOT WORKING DUE TO UNSUFFICIENT EPITECH-RELATED MICROSOFT PERMISSIONS
router.post("/sendEmail", async (req, res) => {
  const sendEmail = async (token, token_type, to, from, subject, message) => {
    try {
      const response = await axios.post(
        "https://graph.microsoft.com/v1.0/me/sendMail",
        {
          message: {
            subject: subject,
            body: {
              contentType: "Text",
              content: message,
            },
            toRecipients: [
              {
                emailAddress: {
                  address: to,
                },
              },
            ],
            from: {
              emailAddress: {
                address: from,
              },
            },
          },
        },
        {
          headers: {
            Authorization: `${token_type} ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      return null;
    }
  };

  const { user } = req.body;

  if (!user) {
    res.status(400).send("Bad request");
    return;
  }

  let access_token = user?.auth?.outlook?.access_token;
  let token_type = user?.auth?.outlook?.token_type;
  if (!access_token || !token_type) {
    res.status(400).send("Bad request");
    return;
  }

  try {
    await sendEmail(
      access_token,
      token_type,
      user.email,
      user.email,
      "AREA - Email reaction executed",
      "Your sendEmail reaction has been executed by the corresponding action."
    );
    res.status(200).send("OK");
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

module.exports = router;
