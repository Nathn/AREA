const axios = require("axios");
const { google } = require("googleapis");

const User = require("@/models/User");
const Service = require("@/models/Service");

let actionsPoolInterval;
let services = [];
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
      // save new tokens in database
      user.auth.google.access_token = newTokens.access_token;
      user.auth.google.refresh_token = newTokens.refresh_token;
      await user.save();
    } catch (error) {
      console.log("Error refreshing access token:", error);
      return false;
    }
  }
  return true;
}

function getServiceFromAR(ar) {
  return services.find((service) => ar.startsWith(service.name_short));
}

function getIdFromAR(ar) {
  return ar.split("_")[1];
}

async function actionsPool() {
  let users = await User.find({});
  users.forEach((user) => {
    if (!currentStateOfThings[user._id]) {
      currentStateOfThings[user._id] = {};
    }
    user.action_reactions.forEach(async (ar) => {
      let service_action = getServiceFromAR(ar.action);
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
      if (!currentStateOfThings[user._id][service_action.name_short]) {
        currentStateOfThings[user._id][service_action.name_short] = {};
        // Call the appropriate base values route to populate the currentStateOfThings
        await axios
          .post(`${process.env.SERVER_URL}${service_action.route}/baseValues`, {
            user: user,
          })
          .then((response) => {
            currentStateOfThings[user._id][service_action.name_short] =
              response.data;
          })
          .catch((error) => {
            console.log(
              `Error getting the base values for service ${service_action.name_short}: ${error}`
            );
          });
      }
      // Call all the appropriate action routes
      await axios
        .post(
          `${process.env.SERVER_URL}${
            service_action.route
          }/action/${getIdFromAR(ar.action)}`,
          {
            user: user,
            baseValues:
              currentStateOfThings[user._id][service_action.name_short],
          }
        )
        .then((response) => {
          currentStateOfThings[user._id][service_action.name_short][
            response.data.baseValuesId
          ] = response.data.newBaseValues;
          // then call reaction routes if response.data.result returned true
          let service_reaction = getServiceFromAR(ar.reaction);
          if (response.data.result) {
            axios
              .post(
                `${process.env.SERVER_URL}${
                  service_reaction.route
                }/reaction/${getIdFromAR(ar.reaction)}`,
                {
                  user: user,
                }
              )
              .then((response) => {
                console.log(`Successfully called reaction ${ar.reaction}`);
              })
              .catch((error) => {
                console.log(
                  `Error calling reaction route for reaction ${ar.reaction}: ${error}`
                );
              });
          }
        })
        .catch((error) => {
          console.log(
            `Error calling action route for action ${ar.action}: ${error}`
          );
        });
    });
  });
}

async function startActionsPool() {
  services = await Service.find({});
  actionsPoolInterval = setInterval(actionsPool, 5000);
}

function stopActionsPool() {
  clearInterval(actionsPoolInterval);
}

module.exports = {
  startActionsPool,
  stopActionsPool,
};
