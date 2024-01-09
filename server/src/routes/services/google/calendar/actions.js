const express = require("express");
const router = express.Router();
const { google } = require("googleapis");

router.post("/eventCreation", async (req, res) => {
  /*
    ACTION:
    - Returns true if there is a new event in the primary calendar
      of the account compared to the baseValues.events
    - Returns false otherwise

    Has no side effects
  */
  const { user, baseValues } = req.body;
  const usefulBaseValues = baseValues?.events;
  if (!user || !usefulBaseValues) {
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
  try {
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    // Check if there a new file in the account compared to the usefulBaseValues
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
    let newEvents = events.filter((event) => {
      return !usefulBaseValues.some((baseEvent) => baseEvent.id === event.id);
    });
    res.status(200).send({
      result: newEvents.length > 0,
      newBaseValues: events,
      baseValuesId: "events",
      reactionNeededBaseValues: null,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

module.exports = router;
