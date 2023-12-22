const { google } = require("googleapis");

const User = require('@/models/User');

let actionsPoolInterval;
const services = [
  {
    name: "gmail",
    route: "/auth/google/gmail",
    type: "google",
  },
  {
    name: "drive",
    route: "/auth/google/drive",
    type: "google",
  },
]

function areGoogleServicesInvolved(ar) {
  let googleServices = services.filter(service => service.type === "google").map(service => service.name);
  for (let i = 0; i < googleServices.length; i++) {
    if (ar.action.startsWith(googleServices[i]) || ar.reaction.startsWith(googleServices[i])) {
      return true;
    }
  }
}

async function checkGoogleServicesConnection(user, oauth2Client) {
  let access_token = user?.auth?.google?.access_token;
  let refresh_token = user?.auth?.google?.refresh_token;
  if (!access_token || !refresh_token) {
    return false;
  }
  oauth2Client.setCredentials({
    access_token: access_token,
    refresh_token: refresh_token,
  });
  // Check if token is expired
  if (oauth2Client.isTokenExpiring()) {
    try {
      const newTokens = await oauth2Client.refreshAccessToken();
      oauth2Client.setCredentials(newTokens);
      // TODO: save new tokens in database
    } catch (error) {
      console.log("Error refreshing access token:", error);
      return false;
    }
  }
  return true;
}

async function actionsPool() {
  let users = await User.find({});
  users.forEach(user => {
    user.action_reactions.forEach(ar => {
      if (areGoogleServicesInvolved(ar)) {
        const oauth2Client = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET,
          process.env.GOOGLE_CALLBACK_URL
        );
        if (!checkGoogleServicesConnection(user, oauth2Client)) {
          return; // skip this action reaction
        }
      }
      // TODO: Call all the appropriate action routes
    });
  });
}

function startActionsPool() {
  actionsPoolInterval = setInterval(actionsPool, 5000);
}

function stopActionsPool() {
  clearInterval(actionsPoolInterval);
}

module.exports = {
  startActionsPool,
  stopActionsPool,
};
