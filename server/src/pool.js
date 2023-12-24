const axios = require("axios");
const { google } = require("googleapis");

const User = require("@/models/User");

let actionsPoolInterval;

const services = [
  {
    name: "gmail",
    route: "/services/google/gmail",
    type: "google",
  },
  {
    name: "drive",
    route: "/services/google/drive",
    type: "google",
  },
];
let currentStateOfThings = {};

function areGoogleServicesInvolved(ar) {
  let googleServices = services
    .filter((service) => service.type === "google")
    .map((service) => service.name);
  for (let i = 0; i < googleServices.length; i++) {
    if (
      ar.action.startsWith(googleServices[i]) ||
      ar.reaction.startsWith(googleServices[i])
    ) {
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

function getServiceFromAction(action) {
  return services.find((service) => action.startsWith(service.name));
}

function getIdFromAction(action) {
  return action.split("_")[1];
}

async function actionsPool() {
  let users = await User.find({});
  users.forEach((user) => {
    if (!currentStateOfThings[user._id]) {
      currentStateOfThings[user._id] = {};
    }
    user.action_reactions.forEach(async (ar) => {
      let service = getServiceFromAction(ar.action);
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
      if (!currentStateOfThings[user._id][service.name]) {
        currentStateOfThings[user._id][service.name] = {};
        // Call the appropriate base values route to populate the currentStateOfThings
        await axios
          .post(`${process.env.SERVER_URL}${service.route}/baseValues`, {
            user: user,
          })
          .then((response) => {
            currentStateOfThings[user._id][service.name] = response.data;
          })
          .catch((error) => {
            console.log(
              `Error getting the base values for service ${service.name}: ${error}`
            );
          });
      }
      // Call all the appropriate action routes
      await axios
        .post(
          `${process.env.SERVER_URL}${service.route}/action/${getIdFromAction(
            ar.action
          )}`,
          {
            user: user,
            baseValues: currentStateOfThings[user._id][service.name],
          }
        )
        .then((response) => {
          currentStateOfThings[user._id][service.name][
            response.data.baseValuesId
          ] = response.data.newBaseValues;
          // then call reaction routes if response.data.result returned true
        })
        .catch((error) => {
          console.log(
            `Error calling action route for action ${ar.action}: ${error}`
          );
        });
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
