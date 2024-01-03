const express = require("express");
const router = express.Router();
const { google } = require("googleapis");

router.post("/baseValues", async (req, res) => {
  const { user } = req.body;
  if (!user) {
    res.status(400).send("Bad request");
    return;
  }
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
  );
  let access_token = user?.auth?.google?.access_token;
  let refresh_token = user?.auth?.google?.refresh_token;
  if (!access_token || !refresh_token) {
    res.status(400).send("Bad request");
    return;
  }
  oauth2Client.setCredentials({
    access_token: access_token,
    refresh_token: refresh_token,
  });
  if (oauth2Client.isTokenExpiring()) {
    res.status(400).send("Bad request");
    return;
  }
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });
  try {
    let response = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
      showDeleted: false,
    });
    let events = response.data.items.filter(
      (event) => event.creator.email === user.email
    );
    res.status(200).send({
      events: events,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

module.exports = router;
