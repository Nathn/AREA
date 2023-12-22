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

async function checkGoogleServicesConnection(ar, user) {
  // TODO : Check that the access_token is stil valid
  // If not, refresh it
}

async function actionsPool() {
  let users = await User.find({});
  users.forEach(user => {
    user.action_reactions.forEach(ar => {
      if (areGoogleServicesInvolved(ar)) {
        checkGoogleServicesConnection(ar, user);
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
