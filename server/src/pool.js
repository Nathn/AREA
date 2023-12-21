const User = require('@/models/User');

let actionsPoolInterval;

async function actionsPool() {
  let users = await User.find({});
  users.forEach(user => {
    user.action_reactions.forEach(ar => {
      // TODO
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
