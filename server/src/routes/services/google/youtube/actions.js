const express = require("express");
const router = express.Router();
const { google } = require("googleapis");

router.post("/videoUpload", async (req, res) => {
  /*
    ACTION:
    - Returns true if there is a new video in the account compared to the baseValues
    - Returns false otherwise

    Has no side effects
  */
  const { user, baseValues } = req.body;
  const usefulBaseValues = baseValues?.videosUploaded;
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
    const youtube = google.youtube({ version: "v3", auth: oauth2Client });
    let response = await youtube.channels.list({
      part: "snippet,contentDetails,statistics",
      mine: true,
    });
    let channel = response.data?.items[0];
    if (!channel) {
      res.status(400).send("Bad request");
      return;
    }
    let uploadsListId = channel.contentDetails.relatedPlaylists.uploads;
    let videos = [];
    let nextPageToken = "";
    while (true) {
      response = await youtube.playlistItems.list({
        part: "snippet,contentDetails",
        playlistId: uploadsListId,
        maxResults: 50,
        pageToken: nextPageToken,
      });
      videos = videos.concat(response.data.items);
      nextPageToken = response.data.nextPageToken;
      if (!nextPageToken) break;
    }
    let newVideos = videos.filter((video) => {
      return !usefulBaseValues.some((baseVideo) => baseVideo.id === video.id);
    });
    res.status(200).send({
      result: newVideos.length > 0,
      newBaseValues: videos,
      baseValuesId: "videosUploaded",
      reactionNeededBaseValues: null,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

router.post("/newComment", async (req, res) => {
  /*
    ACTION:
    - Returns true if there is a new comment under Youtube videos
      of the account compared to the baseValues
    - Returns false otherwise

    Has no side effects
  */
  const { user, baseValues } = req.body;
  const usefulBaseValues = baseValues?.commentsOnChannel;
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
    const youtube = google.youtube({ version: "v3", auth: oauth2Client });
    let response = await youtube.channels.list({
      part: "snippet,contentDetails,statistics",
      mine: true,
    });
    let channel = response.data?.items[0];
    if (!channel) {
      res.status(400).send("Bad request");
      return;
    }
    let comments = [];
    nextPageToken = "";
    while (true) {
      response = await youtube.commentThreads.list({
        part: "snippet",
        allThreadsRelatedToChannelId: channel.id,
        maxResults: 50,
        pageToken: nextPageToken,
      });
      comments = comments.concat(response.data.items);
      nextPageToken = response.data.nextPageToken;
      if (!nextPageToken) break;
    }
    let newComments = comments.filter((comment) => {
      return !usefulBaseValues.some(
        (baseComment) => baseComment.id === comment.id
      );
    });
    res.status(200).send({
      result: newComments.length > 0,
      newBaseValues: comments,
      baseValuesId: "commentsOnChannel",
      reactionNeededBaseValues: null,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

module.exports = router;
